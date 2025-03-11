import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'finance',
      entities: [Transaction, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction, User]),
  ],
  exports: [TypeOrmModule],
})
export class DataAccessModule {}
