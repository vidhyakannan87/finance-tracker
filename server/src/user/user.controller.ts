import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Post, Body } from '@nestjs/common';
import { User } from 'src/data_access/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(id: string) {
    return await this.userService.findOne(id);
  }

  @Post()
  async createUser(@Body() user: Partial<User>): Promise<User> {
    return await this.userService.create(user);
  }

  @Post('login')
  async login(
    @Body() user: { email: string; password: string },
  ): Promise<{ accessToken: string } | null> {
    return await this.authService.validateUser(user.email, user.password);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() user: { email: string; newPassword: string },
  ): Promise<void> {
    await this.userService.updateUserPassword(user.email, user.newPassword);
  }
}
