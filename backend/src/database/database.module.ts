import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/ai/entities/message.entity';
import { ConfigService } from '@nestjs/config';
import { File } from 'src/user/entities/file.entity';
import { Token } from 'src/user/entities/tokens.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        username: configService.getOrThrow('POSTGRESQL_PG_USER'),
        password: configService.getOrThrow('POSTGRESQL_PG_PASSWORD'),
        database: configService.getOrThrow('POSTGRESQL_PG_DB'),
        synchronize: true, // TODO: REMOVE IN PROD
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Message, File, Token]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
