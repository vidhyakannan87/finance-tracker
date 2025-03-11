import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Post, Body } from '@nestjs/common';
import { User } from 'src/data_access/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async getUserById(id: string) {
    return await this.userService.findOne(id);
  }

  @Post()
  async createUser(@Body() user: Partial<User>): Promise<User> {
    return await this.userService.create(user);
  }
}
