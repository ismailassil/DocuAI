import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { Request } from 'express';
import { EXTRACTED_JWT_PAYLOAD } from '../entities/jwt.payload';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers['authorization'];

    if (!auth || typeof auth !== 'string') {
      throw new UnauthorizedException('Access Token missing');
    }

    const token: string = auth.replace(`Bearer `, '');

    try {
      const decode: EXTRACTED_JWT_PAYLOAD = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_KEY'),
      });

      /** Only if the user logout out */
      const cachedData = await this.cacheManager.get(`blacklist:${token}`);
      if (cachedData) throw new Error('Blacklisted Token');

      request['token'] = token;
      request['user'] = decode;
    } catch (error) {
      console.error('Error JWT', error);
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('JWT NOT VALID', error.message);
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid Token', error.message);
      } else if (error instanceof NotBeforeError) {
        throw new ForbiddenException('JWT Token Not Active Yet', error.message);
      }
      throw new UnauthorizedException('Auth Failed');
    }

    return true;
  }
}
