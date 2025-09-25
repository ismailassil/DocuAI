import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { AIService } from 'src/ai/ai.service';
import { MinIoModule } from 'src/min-io/min-io.module';

@Module({
  imports: [DatabaseModule, MinIoModule],
  providers: [UserService, AIService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
