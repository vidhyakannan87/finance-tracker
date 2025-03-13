import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TransactionModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      // validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    CategoriesModule,
  ],
  controllers: [AppController, CategoriesController],
  providers: [AppService],
})
export class AppModule {}
