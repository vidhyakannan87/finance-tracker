import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DataAccessModule } from 'src/data_access/data-access.module';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DataAccessModule, ConfigModule, AuthModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
