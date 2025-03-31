import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ManyToOne } from 'typeorm';
import { SpendingCategory } from 'common/spending-category.enum';


@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column({ type: 'enum', enum: SpendingCategory })
  category: SpendingCategory;

  @Column({ type: 'varchar', nullable: true })
  subcategory: string;

  @Column('float')
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
