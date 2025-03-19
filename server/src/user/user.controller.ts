import { Controller, Get, UseGuards, Headers, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Post, Body } from '@nestjs/common';
import { User } from 'src/data_access/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDTO } from './user.controller.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserByProfile(@Headers('authorization') jwtToken: string) {
    return await this.authService.getUserFromToken(jwtToken.split(' ')[1]);
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

  @Patch('forgot-password')
  async updatePassword(
    @Body() user: { email: string; newPassword: string },
  ): Promise<void> {
    await this.userService.updateUserPassword(user.email, user.newPassword);
  }

  @Patch('reset-password')
  @UseGuards(AuthGuard('jwt'))
  async resetPassword(
    @Headers('authorization') jwtToken: string,
    @Body()
    userCreds: {
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<void> {
    const user = await this.authService.getUserFromToken(jwtToken.split(' ')[1]);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userService.resetUserPassword(user, userCreds.currentPassword, userCreds.newPassword);
  }

   @Patch('update')
   @UseGuards(AuthGuard('jwt'))
    async updateUser(
      @Headers('authorization') jwtToken: string,
      @Body() userProfile: UpdateUserDTO,
    ): Promise<void> {
      const user = await this.authService.getUserFromToken(jwtToken.split(' ')[1]);
      if(!user) {
        throw new Error('User not found');
      }
      await this.userService.updateUser(user, userProfile);
    }

}
