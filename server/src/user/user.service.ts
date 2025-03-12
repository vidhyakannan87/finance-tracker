import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data_access/entities/user.entity';
import { Repository } from 'typeorm';
import * as brcypt from 'bcrypt';

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

  async create(user: Partial<User>): Promise<User> {
    const saltRounds = this.configService.get('SALT_ROUNDS');
    const hashedPassword = await brcypt.hash(
      user.password,
      parseInt(saltRounds, 10),
    );
    return this.userRepository.save({ ...user, password: hashedPassword });
  }
}
