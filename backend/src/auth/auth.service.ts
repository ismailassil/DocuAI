import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from './entities/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.databaseService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isMatch: boolean = await compare(password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Invalid username or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'refresh-token-secret-key',
    });

    return {
      accessToken,
      refreshToken,
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

    const payload = {
      sub: newUser.id,
      username: newUser.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'refresh-token-secret-key',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
