import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MinIoModule } from 'src/min-io/min-io.module';

@Module({
  imports: [DatabaseModule, MinIoModule],
  providers: [AIService],
  controllers: [AIController],
})
export class AIModule {}
