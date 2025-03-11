import { Transaction } from './transaction.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    transactions: Transaction[];
}
