import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { DataAccessModule } from '../data_access/data-access.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DataAccessModule, AuthModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
