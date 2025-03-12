import { Transaction } from 'src/data_access/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionDTO } from './transaction.dto';
import { AuthService } from 'src/auth/auth.service';
export declare class TransactionService {
    private readonly transactionRepository;
    private readonly authService;
    constructor(transactionRepository: Repository<Transaction>, authService: AuthService);
    findAll(): Promise<TransactionDTO[]>;
    findOne(id: string): Promise<TransactionDTO[]>;
    findAllTransactionsByUser(userId: string): Promise<TransactionDTO[]>;
    create(token: string, transaction: Partial<Transaction>): Promise<void>;
}
