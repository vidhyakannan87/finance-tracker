import { UserService } from './user.service';
import { User } from 'src/data_access/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    createUser(user: Partial<User>): Promise<User>;
    login(user: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
    } | null>;
}
