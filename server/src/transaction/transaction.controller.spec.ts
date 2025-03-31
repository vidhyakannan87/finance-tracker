import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from 'data_access/entities/transaction.entity';
import { TransactionDTO } from './transaction.dto';
import { SpendingCategory } from 'common/spending-category.enum';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransaction: Transaction = {
    transactionId: '1',
    amount: 100,
    category: SpendingCategory.DINING,
    subcategory: 'Groceries',
    date: new Date(),
    description: 'Test transaction',
  } as Transaction;

  const mockTransactionDTO: TransactionDTO = {
    amount: 100,
    category: SpendingCategory.DINING,
    subcategory: 'Groceries',
    transactionDate: new Date(),
    description: 'Test transaction',
  };

  const mockJwtToken = 'Bearer mockToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockTransactionDTO]),
            findOne: jest.fn().mockResolvedValue([mockTransactionDTO]),
            create: jest.fn().mockResolvedValue(mockTransactionDTO),
            update: jest.fn().mockResolvedValue(mockTransactionDTO),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const result = await controller.findAll(mockJwtToken);
      expect(result).toEqual([mockTransactionDTO]);
      expect(service.findAll).toHaveBeenCalledWith('mockToken');
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const result = await controller.findOne(mockJwtToken, '1');
      expect(result).toEqual([mockTransactionDTO]);
      expect(service.findOne).toHaveBeenCalledWith('1', 'mockToken');
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const result = await controller.create(mockTransaction, mockJwtToken);
      expect(result).toEqual(mockTransactionDTO);
      expect(service.create).toHaveBeenCalledWith('mockToken', mockTransaction);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const result = await controller.update(
        mockTransaction,
        mockJwtToken,
        '1',
      );
      expect(result).toEqual(mockTransactionDTO);
      expect(service.update).toHaveBeenCalledWith(
        '1',
        'mockToken',
        mockTransaction,
      );
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      const result = await controller.delete(mockJwtToken, '1');
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith('1', 'mockToken');
    });
  });
});
