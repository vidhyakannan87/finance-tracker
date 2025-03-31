import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'data_access/entities/user.entity';
import { AuthService } from '../auth/auth.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    password: 'hashedPassword',
    transactions: []
  } as User;

  const mockJwtToken = 'Bearer mockToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
            updateUser: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUserFromToken: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('create', () => {
    it('should create a new user', async () => {
      const result = await controller.createUser(mockUser);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const result = await controller.updateUser(mockJwtToken, mockUser);
      expect(service.updateUser).toHaveBeenCalledWith(mockUser, mockUser);
    });
  });
});
