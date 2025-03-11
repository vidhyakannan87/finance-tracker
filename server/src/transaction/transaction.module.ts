import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/data_access/data-access.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DataAccessModule, UserModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
