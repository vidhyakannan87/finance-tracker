import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDto, TransactionDTO } from './transaction.dto';

@Controller('user/transactions')
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

  @Post()
  create(
    @Body() transaction: CreateTransactionDto,
    @Headers('Authorization') jwtToken: string,
  ): Promise<void> {
    const token = jwtToken?.split(' ')[1];
    return this.transactionService.create(token, transaction);
  }
}
