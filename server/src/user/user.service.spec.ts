import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from 'data_access/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let configService: ConfigService;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    password: 'hashedPassword',
    transactions: []
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('10'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = await service.findOne('1');
      expect(user).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = await service.findByEmail('test@test.com');
      expect(user).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
      const result = await service.create({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      await service.updateUser(mockUser, { email: 'updated@test.com' });
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('resetUserPassword', () => {
    it('should reset user password when current password is valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      await service.resetUserPassword(mockUser, 'currentPassword', 'newPassword');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw error when current password is invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      await expect(service.resetUserPassword(mockUser, 'wrongPassword', 'newPassword'))
        .rejects.toThrow('Invalid password');
    });
  });

  describe('updateUserPassword', () => {
    it('should update user password', async () => {
      await service.updateUserPassword('test@test.com', 'newPassword');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.updateUserPassword('nonexistent@test.com', 'newPassword'))
        .rejects.toThrow('User not found');
    });
  });
});
