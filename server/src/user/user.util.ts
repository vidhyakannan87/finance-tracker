import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export const generateHashedPassword = async (configService:ConfigService, password: string, ): Promise<string> => {
    const saltRounds = configService.get('SALT_ROUNDS');
    return await bcrypt.hash(password, parseInt(saltRounds, 10));
};  