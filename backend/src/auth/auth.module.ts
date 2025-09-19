import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [JwtModule.register({ global: true }), DatabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
