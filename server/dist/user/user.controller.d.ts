import { UserService } from './user.service';
import { User } from 'src/data_access/entities/user.entity';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    createUser(user: Partial<User>): Promise<User>;
}
