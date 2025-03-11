import { User } from './user.entity';
export declare class Transaction {
    transactionId: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    user: User;
}
