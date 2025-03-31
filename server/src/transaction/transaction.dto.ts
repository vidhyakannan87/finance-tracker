import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SpendingCategory } from 'common/spending-category.enum';

export class CreateTransactionDto {
  @IsNumber()
  amount!: number;

  @IsDate()
  transactionDate!: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsEnum(SpendingCategory, {
    message: 'Category must be a valid SpendingCategory',
  })
  category!: SpendingCategory;

  @IsString()
  @IsOptional()
  subcategory?: string;
}

export class TransactionDTO {
  @IsEnum(SpendingCategory)
  category: SpendingCategory;

  @IsString()
  @IsOptional()
  subcategory?: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsDate()
  transactionDate: Date;
}
