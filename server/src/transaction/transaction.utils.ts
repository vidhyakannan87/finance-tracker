
import { TransactionDTO } from './transaction.dto';
import { Transaction } from 'data_access/entities/transaction.entity';
export const toTransactionDTOs = (
  transactions: Transaction | Transaction[],
): TransactionDTO[] => {
  if (Array.isArray(transactions)) {
    return transactions.map((transaction) => toTransactionDTO(transaction));
  }
  return [toTransactionDTO(transactions)];
};

export const toTransactionDTO = (transaction: Transaction): TransactionDTO => {
  return {
    ...transaction,
    transactionDate: transaction.date,
  };
};
