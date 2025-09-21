import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './entities/register.dto';
import { JWT_PAYLOAD } from './entities/jwt.payload';
import { ConfigService } from '@nestjs/config';
import { Token } from 'src/user/entities/tokens.entity';
import { UserDTO } from './entities/user.dto';
import {
  GOOGLE_AUTH_KEYS,
  GOOGLE_RESPONSE_TOKEN,
  GOOGLE_RESPONSE_USER_INFO,
  GOOGLE_TOKEN_KEYS,
  GOOGLE_USER_INFO_KEYS,
} from './entities/auth.keys';
import { Cache } from '@nestjs/cache-manager';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly oauth2Token = 'https://oauth2.googleapis.com/token';
  private readonly oauth2UserInfo =
    'https://www.googleapis.com/oauth2/v1/userinfo';

  constructor(
    private databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.databaseService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isMatch: boolean = await compare(password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Invalid username or password');
    }

    const payload: JWT_PAYLOAD = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = this.signJWT(false, payload);
    const refreshToken = this.signJWT(true, payload);
    await this.databaseService.registerRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
      data: new UserDTO(user),
    };
  }

  async registerUser(registerDto: RegisterDTO) {
    const { email, password, username } = registerDto;

    const user = await this.databaseService.findUserByUsernameOrEmail(
      username,
      email,
    );

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hash_pass = await hash(password, 10);

    const newUser = await this.databaseService.createUser(
      registerDto,
      hash_pass,
    );

    if (!newUser) {
      throw new ConflictException('User already exists');
    }

    const payload: JWT_PAYLOAD = {
      sub: newUser.id,
      username: newUser.username,
    };

    const accessToken = this.signJWT(false, payload);
    const refreshToken = this.signJWT(true, payload);
    await this.databaseService.registerRefreshToken(newUser, refreshToken);

    return {
      accessToken,
      refreshToken,
      data: new UserDTO(newUser),
    };
  }

  public signJWT(isRefresh: boolean, payload: JWT_PAYLOAD) {
    const expiresIn = isRefresh ? '7d' : '10s';
    const key_name = isRefresh ? 'JWT_REFRESH_KEY' : 'JWT_ACCESS_KEY';

    return this.jwtService.sign(
      { sub: payload.sub, username: payload.username },
      { secret: this.configService.getOrThrow(key_name), expiresIn },
    );
  }

  async refreshToken(tokenInfo: Token, decode: JWT_PAYLOAD) {
    const updatedToken = new Token({ ...tokenInfo, is_used: true });

    await this.databaseService.updateTokenInfo(updatedToken);

    const accessToken = this.signJWT(false, decode);
    const refreshToken = this.signJWT(true, decode);

    await this.databaseService.registerRefreshToken(
      updatedToken.user,
      refreshToken,
    );

    const user = await this.databaseService.getUserByUsername(decode.username);

    return {
      accessToken,
      refreshToken,
      data: new UserDTO(user),
    };
  }

  async getGoogleAuthURL() {
    const state = crypto.randomUUID();

    const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options: Record<GOOGLE_AUTH_KEYS, string> = {
      redirect_uri: this.configService.getOrThrow('GOOGLE_CALLBACKURL'),
      client_id: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
      state: state,
    };

    await this.cacheManager.set(`state:${state}`, state);

    const param = new URLSearchParams(options);

    return `${rootURL}?${param.toString()}`;
  }

  async getGoogleTokens(code: string) {
    const tokenOptions: Record<GOOGLE_TOKEN_KEYS, string> = {
      code,
      client_secret: this.configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      redirect_uri: this.configService.getOrThrow('GOOGLE_CALLBACKURL'),
      client_id: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
      grant_type: 'authorization_code',
    };

    const url = new URL(this.oauth2Token);
    url.search = new URLSearchParams(tokenOptions).toString();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return (await response.json()) as GOOGLE_RESPONSE_TOKEN;
    } catch (error) {
      throw new InternalServerErrorException(
        'Token retrieval from Google failed',
        error as Error,
      );
    }
  }

  async getUserInfo(access_token: string, id_token: string) {
    const userInfoOptions: Record<GOOGLE_USER_INFO_KEYS, string> = {
      alt: 'json',
      access_token,
    };

    const url = new URL(this.oauth2UserInfo);
    url.search = new URLSearchParams(userInfoOptions).toString();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      });

      return (await response.json()) as GOOGLE_RESPONSE_USER_INFO;
    } catch (error) {
      throw new InternalServerErrorException(
        'UserInfo retrieval from Google failed',
        error as Error,
      );
    }
  }

  async validateUserAuth(userInfo: GOOGLE_RESPONSE_USER_INFO) {
    const { email } = userInfo;

    let payload: JWT_PAYLOAD;

    let refUser: User;

    const user = await this.databaseService.getUserByEmail(email);
    if (user) {
      payload = {
        sub: user.id,
        username: user.username,
      };

      refUser = user;
    } else {
      const newUser = await this.databaseService.createUser(
        new RegisterDTO({
          username: (userInfo.family_name + '-' + userInfo.given_name)
            .replaceAll(' ', '')
            .toLowerCase(),
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          email: userInfo.email,
          password: '',
        }),
        '',
      );
      if (!newUser) {
        throw new ConflictException('User Already Exists');
      }

      payload = {
        sub: newUser.id,
        username: newUser.username,
      };

      refUser = newUser;
    }

    const accessToken = this.signJWT(false, payload);
    const refreshToken = this.signJWT(true, payload);
    await this.databaseService.registerRefreshToken(refUser, refreshToken);

    return { accessToken, refreshToken };
  }

  async isValidState(state: string) {
    const key = `state:${state}`;

    const retrievedState = await this.cacheManager.get(key);

    if (retrievedState) {
      await this.cacheManager.del(key);
      return true;
    }
    return false;
  }
}
