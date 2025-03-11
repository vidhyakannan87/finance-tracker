import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DataAccessModule } from 'src/data_access/data-access.module';
import { UserController } from './user.controller';

@Module({
  imports: [DataAccessModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
