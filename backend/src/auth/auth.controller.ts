import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO } from './entities/signIn.dto';
import type { Response } from 'express';
import { RegisterDTO } from './entities/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    signInDto: signInDTO,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.validateUser(
      signInDto.username,
      signInDto.password,
    );

    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 2 * 60000,
    });

    response.header('Authorization', 'Bearer ' + accessToken);

    return { success: true, message: 'Login Successful' };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    registerDto: RegisterDTO,
    @Res()
    res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.registerUser(registerDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 2 * 60000,
      sameSite: 'strict',
      secure: false,
    });
    res.setHeader('Authorization', 'Bearer ' + accessToken);

    return res.send({ success: true, message: 'Registration Successful' });
  }
}
