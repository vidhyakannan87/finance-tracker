import { TransactionService } from './transaction.service';
import { Transaction } from 'src/data_access/entities/transaction.entity';
import { TransactionDTO } from './transaction.dto';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    findAll(): Promise<TransactionDTO[]>;
    findOne(id: string): Promise<TransactionDTO[]>;
    findAllTransactionsByUser(userId: string): Promise<TransactionDTO[]>;
    create(transaction: Partial<Transaction>, jwtToken: string): Promise<void>;
}
