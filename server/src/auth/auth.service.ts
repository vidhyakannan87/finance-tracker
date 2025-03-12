import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data_access/entities/user.entity';
import { Repository } from 'typeorm';
import * as brcypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string } | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await brcypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }

  async getUserFromToken(token: string): Promise<User> {
    const decoded = this.jwtService.decode(token) as { sub: string };
    return this.userRepository.findOne({ where: { id: decoded.sub } });
  }
}
