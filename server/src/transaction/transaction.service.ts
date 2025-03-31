import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'data_access/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionDTO } from './transaction.dto';
import { toTransactionDTO, toTransactionDTOs } from './transaction.utils';
import { AuthService } from '../auth/auth.service';
import { SpendingCategory } from 'common/spending-category.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly authService: AuthService,
  ) {}

  async findAll(token: string): Promise<TransactionDTO[]> {
    const user = await this.authService.getUserFromToken(token);
    const transactions = await this.transactionRepository.find({
      where: { user: user },
    });
    return toTransactionDTOs(transactions);
  }

  async findOne(id: string, token: string): Promise<TransactionDTO[]> {
    const user = await this.authService.getUserFromToken(token);
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId: id, user: user },
    });
    return toTransactionDTOs(transaction);
  }

  async create(
    token: string,
    transaction: Transaction,
  ): Promise<TransactionDTO> {
    const newTransaction = this.transactionRepository.create(transaction);
    console.log(transaction.category);
    transaction.category =
      SpendingCategory[
        transaction.category.toUpperCase() as keyof typeof SpendingCategory
      ] || SpendingCategory.UNKNOWN;

    console.log(transaction.category);

    const user = await this.authService.getUserFromToken(token);
    newTransaction.user = user;
    newTransaction.category = transaction.category;
    return toTransactionDTO(
      await this.transactionRepository.save(newTransaction),
    );
  }

  async update(
    id: string,
    token: string,
    modifiedTransaction: Transaction,
  ): Promise<TransactionDTO> {
    // Retrieve user from token
    const user = await this.authService.getUserFromToken(token);
    if (!user) {
      throw new Error('User not found or unauthorized');
    }

    // Fetch the existing transaction
    const existingTransaction = await this.transactionRepository.findOne({
      where: { transactionId: id, user },
    });

    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    // Update transaction fields with type safety
    const updatedTransaction = {
      ...existingTransaction,
      amount: modifiedTransaction.amount,
      category:
        SpendingCategory[
          modifiedTransaction.category.toUpperCase() as keyof typeof SpendingCategory
        ] || SpendingCategory.UNKNOWN,
      subcategory: modifiedTransaction.subcategory,
      date: modifiedTransaction.date,
      description: modifiedTransaction.description,
      user, // Ensure user consistency
    };

    // Save and return updated transaction DTO
    return toTransactionDTO(
      await this.transactionRepository.save(updatedTransaction),
    );
  }

  async delete(id: string, token: string): Promise<void> {
    // Retrieve user from token
    const user = await this.authService.getUserFromToken(token);
    if (!user) {
      throw new Error('User not found or unauthorized');
    }

    // Fetch the existing transaction
    const existingTransaction = await this.transactionRepository.findOne({
      where: { transactionId: id, user },
    });

    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    // Delete the transaction
    await this.transactionRepository.delete(existingTransaction);
  }
}
