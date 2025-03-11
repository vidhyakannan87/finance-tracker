import { User } from 'src/data_access/entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(userId: string): Promise<User>;
    create(user: Partial<User>): Promise<User>;
}
