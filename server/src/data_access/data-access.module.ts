import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('DATABASE_TYPE') as any,
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Transaction, User],
        migrations: ['dist/migrations/*.js'],
        migrationsTableName: 'migrations',
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Transaction, User]),
  ],
  exports: [TypeOrmModule],
})
export class DataAccessModule {}
