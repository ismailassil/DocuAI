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
import type { Response } from 'express';
import { RegisterDTO } from './entities/register.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { Token } from 'src/user/entities/tokens.entity';
import { JWT_PAYLOAD } from './entities/jwt.payload';

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
    const { accessToken, refreshToken, data } =
      await this.authService.validateUser(
        signInDto.username,
        signInDto.password,
      );

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 2 * 60000,
    });

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

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 2 * 60000,
      sameSite: 'strict',
      secure: false,
    });
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
  @HttpCode(HttpStatus.CREATED)
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const tokenInfo = request['refresh_token_info'] as Token;
    const decode = request['user'] as JWT_PAYLOAD;

    const { accessToken, refreshToken, data } =
      await this.authService.refreshToken(tokenInfo, decode);

    response.clearCookie('refresh_token');

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 24 * 1000,
      sameSite: 'strict',
      secure: false,
    });

    return response.send({
      success: true,
      message: 'Refresh Successful',
      token: accessToken,
      data,
    });
  }
}
