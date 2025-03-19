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

  async resetUserPassword(
    user: User,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    await this.updateUserPassword(user.email, newPassword);
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const updateUserPassword = await generateHashedPassword(
      this.configService,
      newPassword,
    );
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    this.userRepository.save({
      id: user.id,
      password: updateUserPassword,
    });
  }

  async updateUser(user: User, userProfile: Partial<User>): Promise<void> {
    await this.userRepository.save({ ...user, ...userProfile });
  }
}
