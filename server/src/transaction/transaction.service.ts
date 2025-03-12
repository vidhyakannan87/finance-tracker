import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/data_access/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionDTO } from './transaction.dto';
import { toTransactionDTOs } from './transaction.utils';
import { AuthService } from 'src/auth/auth.service';

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
    console.log(transaction);
    return toTransactionDTOs(transaction);
  }

  async findAllTransactionsByUser(userId: string): Promise<TransactionDTO[]> {
    const userTransactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
    });
    return toTransactionDTOs(userTransactions);
  }

  async create(
    token: string,
    transaction: Partial<Transaction>,
  ): Promise<void> {
    const newTransaction = this.transactionRepository.create(transaction);
    const user = await this.authService.getUserFromToken(token);
    newTransaction.user = user;
    this.transactionRepository.save(newTransaction);
  }
}
