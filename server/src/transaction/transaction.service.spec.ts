import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Repository } from 'typeorm';
import { Transaction } from 'data_access/entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SpendingCategory } from 'common/spending-category.enum';
import { TransactionDTO } from './transaction.dto';
import { User } from 'data_access/entities/user.entity';
import { AuthService } from '../auth/auth.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let jwtService: JwtService;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    password: 'password',
    transactions: [],
  } as User;

  const mockTransaction: Transaction = {
    transactionId: '1',
    amount: 100,
    category: SpendingCategory.DINING,
    subcategory: 'Groceries',
    date: new Date(),
    description: 'Test transaction',
    user: mockUser,
  } as Transaction;

  const mockTransactionDTO: TransactionDTO = {
    amount: 100,
    category: SpendingCategory.DINING,
    subcategory: 'Groceries',
    transactionDate: mockTransaction.date,
    description: 'Test transaction',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            find: jest.fn().mockResolvedValue([mockTransaction]),
            findOne: jest.fn().mockResolvedValue(mockTransaction),
            save: jest.fn().mockResolvedValue(mockTransaction),
            create: jest.fn().mockReturnValue(mockTransaction),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUserFromToken: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn().mockReturnValue({ sub: '1' }),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const result = await service.findAll('mockToken');
      expect(result).toEqual([
        {
          ...mockTransactionDTO,
          date: mockTransaction.date,
          transactionId: mockTransaction.transactionId,
          user: mockUser,
        },
      ]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const result = await service.findOne('1', 'mockToken');
      expect(result).toEqual([
        {
          ...mockTransactionDTO,
          date: mockTransaction.date,
          transactionId: mockTransaction.transactionId,
          user: mockUser,
        },
      ]);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { transactionId: '1', user: mockUser },
      });
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const result = await service.create('mockToken', mockTransaction);
      expect(result).toEqual({
        ...mockTransactionDTO,
        date: mockTransaction.date,
        category: mockTransaction.category,
        transactionId: mockTransaction.transactionId,
        user: mockUser,
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const result = await service.update('1', 'mockToken', mockTransaction);
      expect(result).toEqual({
        ...mockTransactionDTO,
        date: mockTransaction.date,
        category: mockTransaction.category,
        transactionId: mockTransaction.transactionId,
        user: mockUser,
      });
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      // Mock finding the transaction first
      const mockFoundTransaction = {
        ...mockTransaction,
        user: mockUser,
      };
      (repository.findOne as jest.Mock).mockResolvedValue(mockFoundTransaction);

      const result = await service.delete('1', 'mockToken');

      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(mockFoundTransaction);
    });
  });
});
