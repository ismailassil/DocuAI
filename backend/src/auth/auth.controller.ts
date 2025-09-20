import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO } from './entities/signIn.dto';
import type { CookieOptions, Response } from 'express';
import { RegisterDTO } from './entities/register.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { Token } from 'src/user/entities/tokens.entity';
import { JWT_PAYLOAD } from './entities/jwt.payload';

@Controller('auth')
export class AuthController {
  private cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 24 * 1000,
    sameSite: 'lax',
    secure: false,
    path: '/',
  };
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    signInDto: signInDTO,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const { accessToken, refreshToken, data } =
      await this.authService.validateUser(
        signInDto.username,
        signInDto.password,
      );

    response.cookie('refresh_token', refreshToken, this.cookieOptions);

    response.header('Authorization', 'Bearer ' + accessToken);

    return { success: true, message: 'Login Successful', data };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    registerDto: RegisterDTO,
    @Res()
    res: Response,
  ) {
    const { accessToken, refreshToken, data } =
      await this.authService.registerUser(registerDto);

    res.cookie('refresh_token', refreshToken, this.cookieOptions);
    res.setHeader('Authorization', 'Bearer ' + accessToken);

    return res.send({
      success: true,
      message: 'Registration Successful',
      data,
    });
  }

  /**
   * This method used to refresh the Access Token
   */
  @Post('refresh-token')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const tokenInfo = request['refresh_token_info'] as Token;
    const decode = request['user'] as JWT_PAYLOAD;

    const { accessToken, refreshToken, data } =
      await this.authService.refreshToken(tokenInfo, decode);

    response.clearCookie('refresh_token');

    response.cookie('refresh_token', refreshToken, this.cookieOptions);

    return response.send({
      success: true,
      message: 'Refresh Successful',
      token: accessToken,
      data,
    });
  }
}
