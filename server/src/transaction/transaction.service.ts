import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/data_access/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto, TransactionDTO } from './transaction.dto';
import { toTransactionDTOs } from './transaction.utils';
import { AuthService } from 'src/auth/auth.service';
import { SpendingCategory } from 'src/common/spending-category.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<TransactionDTO[]> {
    const transactions = await this.transactionRepository.find();
    return toTransactionDTOs(transactions);
  }

  async findOne(id: string): Promise<TransactionDTO[]> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId: id },
    });
    return toTransactionDTOs(transaction);
  }

  async create(
    token: string,
    transaction: CreateTransactionDto,
  ): Promise<void> {
    const newTransaction = this.transactionRepository.create(transaction);
    transaction.category =
      SpendingCategory[
        transaction.category.toUpperCase() as keyof typeof SpendingCategory
      ] || SpendingCategory.UNKNOWN;
    const user = await this.authService.getUserFromToken(token);
    newTransaction.user = user;
    newTransaction.category = transaction.category;
    this.transactionRepository.save(newTransaction);
  }
}
