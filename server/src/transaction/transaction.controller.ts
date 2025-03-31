import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
  Put,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { TransactionDTO } from './transaction.dto';
import { Transaction } from 'data_access/entities/transaction.entity';

@Controller('user/transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(
    @Headers('Authorization') jwtToken: string,
  ): Promise<TransactionDTO[]> {
    const token = jwtToken?.split(' ')[1];
    return this.transactionService.findAll(token);
  }

  @Get(':id')
  findOne(
    @Headers('Authorization') jwtToken: string,
    id: string,
  ): Promise<TransactionDTO[]> {
    const token = jwtToken?.split(' ')[1];
    return this.transactionService.findOne(id, token);
  }

  @Post()
  create(
    @Body() transaction: Transaction,
    @Headers('Authorization') jwtToken: string,
  ): Promise<TransactionDTO> {
    const token = jwtToken?.split(' ')[1];
    return this.transactionService.create(token, transaction);
  }

  @Put(':id')
  update(
    @Body() transaction: Transaction,
    @Headers('Authorization') jwtToken: string,
    id: string,
  ): Promise<TransactionDTO> {
    const token = jwtToken?.split(' ')[1];
    return this.transactionService.update(id, token, transaction);
  }

  @Delete(':id')
  delete(
    @Headers('Authorization') jwtToken: string,
    id: string,
  ): Promise<void> {
    const token = jwtToken?.split(' ')[1];
    return this.transactionService.delete(id, token);
  }
}
