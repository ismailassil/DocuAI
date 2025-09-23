import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly FRONT_URL: string;
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 24 * 1000,
    sameSite: 'lax',
    secure: false,
    path: '/',
  };

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.FRONT_URL = this.configService.getOrThrow('FRONT_URL');
  }

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

  /**
   * Google Auth Endpoint
   */
  @Get('google')
  async authGoogle(@Res() response: Response) {
    const redirectUrl = await this.authService.getGoogleAuthURL();

    return response.send(redirectUrl);
  }

  /**
   * Callback endpoint used after user confirmation.
   * Will be used by google to redirect after confirmation.
   *
   * This endpoint will retrieve the tokens and user
   * info to proceed the validation
   */
  @Get('google/callback')
  async authGoogleCallback(
    @Res() res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    if (!(await this.authService.isValidState(state))) {
      throw new ForbiddenException('Invalid State');
    }

    try {
      const { access_token, id_token } =
        await this.authService.getGoogleTokens(code);

      const userInfo = await this.authService.getUserInfo(
        access_token,
        id_token,
      );

      const { accessToken, refreshToken } =
        await this.authService.validateUserAuth(userInfo);

      res.clearCookie('refresh_token');
      res.cookie('refresh_token', refreshToken, this.cookieOptions);
      res.setHeader('Authorization', 'Bearer ' + accessToken);
    } catch {
      return res.redirect(this.FRONT_URL);
    }

    res.redirect(this.FRONT_URL + '/dashboard');
  }
}
