import { Transaction } from 'src/data_access/entities/transaction.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
export declare class TransactionService {
    private transactionRepository;
    private readonly userService;
    constructor(transactionRepository: Repository<Transaction>, userService: UserService);
    findAll(): Promise<Transaction[]>;
    findOne(id: string): Promise<Transaction>;
    findAllTransactionsByUser(userId: string): Promise<Transaction[]>;
    create(transaction: Partial<Transaction>): Promise<Transaction>;
}
