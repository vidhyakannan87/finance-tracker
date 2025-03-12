import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataAccessModule } from 'src/data_access/data-access.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.auth.guard';

@Module({
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  imports: [
    DataAccessModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
})
export class AuthModule {}
