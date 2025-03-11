import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ManyToOne } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column()
  type: string;

  @Column('float')
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
