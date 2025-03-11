import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/data_access/entities/transaction.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly userService: UserService,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  findOne(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { transactionId: id } });
  }

  findAllTransactionsByUser(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { user: { id: userId } } });
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(transaction);
    const user = await this.userService.findOne(transaction.user.id);
    newTransaction.user = user;
    return this.transactionRepository.save(newTransaction);
  }
}
