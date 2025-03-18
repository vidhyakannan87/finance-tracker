import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data_access/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { generateHashedPassword } from './user.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const hashedPassword = await generateHashedPassword(
      this.configService,
      user.password,
    );
    return this.userRepository.save({ ...user, password: hashedPassword });
  }

  async updateUserPassword(email: string, newPassword: string): Promise<User> {
    const updateUserPassword = await generateHashedPassword(
      this.configService,
      newPassword,
    );
    const user = await this.findByEmail(email);
    if(!user) {
      throw new Error('User not found');
    }
    return this.userRepository.save({
      id: user.id,
      password: updateUserPassword,
    });
  }
}
