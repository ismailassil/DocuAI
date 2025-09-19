import {
  ConflictException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    const expiresIn = isRefresh ? '7d' : '5m';
    const key_name = isRefresh ? 'JWT_REFRESH_KEY' : 'JWT_ACCESS_KEY';

    return this.jwtService.sign(
      { sub: payload.sub, username: payload.username },
      { secret: this.configService.getOrThrow(key_name), expiresIn },
    );
  }

  async refreshToken(tokenInfo: Token, decode: JWT_PAYLOAD) {
    const updatedToken = new Token({ ...tokenInfo, is_used: true });

    console.log(updatedToken);
    console.log(decode);
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
}
