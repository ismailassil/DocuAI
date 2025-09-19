import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, Response: any, next: NextFunction) {
    this.logger.log(`[NEW REQUEST] [METHOD] ${req.method} [PATH] ${req.url}`);
    next();
  }
}
