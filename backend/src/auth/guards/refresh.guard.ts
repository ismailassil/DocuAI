import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EXTRACTED_JWT_PAYLOAD } from '../entities/jwt.payload';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { Token } from 'src/user/entities/tokens.entity';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Only used to check the validity of the Refresh Token
   * The Generation will be done in the Controller
   * */
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['refresh_token'] as string;

    if (!token || token.length === 0)
      throw new UnauthorizedException('Refresh Token Missing');

    try {
      const decode: EXTRACTED_JWT_PAYLOAD = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_REFRESH_KEY'),
      });

      const tokenInfo = await this.databaseService.getTokenInfo(token);
      this.isValidToken(tokenInfo, decode.exp);

      request['refresh_token_info'] = tokenInfo;
      request['user'] = decode;
    } catch (error) {
      console.log('Error from Refresh Guard', (error as Error).message);
      throw new UnauthorizedException(
        'Error While Verifying',
        (error as Error).message,
      );
    }

    return true;
  }

  private isValidToken(tokenInfo: Token | null, exp: number) {
    if (!tokenInfo) throw new UnauthorizedException('Refresh Token Not Found');

    if (tokenInfo.is_used === true) {
      throw new UnauthorizedException('Unauthorized use of token');
    } else if (new Date(exp).getTime() > new Date().getTime()) {
      throw new ForbiddenException('Token exp');
    }
  }
}
