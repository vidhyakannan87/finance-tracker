import { Transaction } from 'src/data_access/entities/transaction.entity';
import { TransactionDTO } from './transaction.dto';

export const toTransactionDTOs = (
  transactions: Transaction | Transaction[],
): TransactionDTO[] => {
  if (Array.isArray(transactions)) {
    return transactions.map((transaction) => toTransactionDTO(transaction));
  }
  return [toTransactionDTO(transactions)];
};

export const toTransactionDTO = (transaction: Transaction): TransactionDTO => {
  const { user, ...transactionData } = transaction;
  return {
    ...transactionData,
    transactionDate: transaction.date,
    userId: user.id,
  };
};
