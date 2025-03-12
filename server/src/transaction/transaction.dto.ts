import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

export class TransactionDTO {
  @IsString()
  type: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsUUID()
  userId: string;

  @IsDate()
  transactionDate: Date;
}
