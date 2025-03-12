import { ConfigService } from '@nestjs/config';
import { User } from 'src/data_access/entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    private readonly configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    findAll(): Promise<User[]>;
    findOne(userId: string): Promise<User>;
    create(user: Partial<User>): Promise<User>;
}
