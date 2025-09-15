import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        username: process.env.POSTGRESQL_PG_USER,
        password: process.env.POSTGRESQL_PG_PASSWORD,
        database: process.env.POSTGRESQL_PG_DB,
        synchronize: true, // TODO: REMOVE IN PROD
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
