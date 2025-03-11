import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from 'src/data_access/entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(id: string): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }

  @Get('user/:userId')
  findAllTransactionsByUser(userId: string): Promise<Transaction[]> {
    return this.transactionService.findAllTransactionsByUser(userId);
  }

  @Post()
  create(@Body() transaction: Partial<Transaction>): Promise<Transaction> {
    return this.transactionService.create(transaction);
  }
}
