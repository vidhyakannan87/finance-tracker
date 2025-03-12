import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from 'src/data_access/entities/transaction.entity';
import { AuthGuard } from '@nestjs/passport';
import { TransactionDTO } from './transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(): Promise<TransactionDTO[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(id: string): Promise<TransactionDTO[]> {
    return this.transactionService.findOne(id);
  }

  @Get('user/:userId')
  findAllTransactionsByUser(userId: string): Promise<TransactionDTO[]> {
    return this.transactionService.findAllTransactionsByUser(userId);
  }

  @Post()
  create(
    @Body() transaction: Partial<Transaction>,
    @Headers('Authorization') jwtToken: string,
  ): Promise<void> {
    const token = jwtToken?.split(' ')[1];
    return this.transactionService.create(token, transaction);
  }
}
