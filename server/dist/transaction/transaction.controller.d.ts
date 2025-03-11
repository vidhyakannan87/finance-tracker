import { TransactionService } from './transaction.service';
import { Transaction } from 'src/data_access/entities/transaction.entity';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    findAll(): Promise<Transaction[]>;
    findOne(id: string): Promise<Transaction>;
    findAllTransactionsByUser(userId: string): Promise<Transaction[]>;
    create(transaction: Partial<Transaction>): Promise<Transaction>;
}
