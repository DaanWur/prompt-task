import { UserNotFoundException } from '@app/exceptions';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/entities/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{
    access_token: string;
    userId: string;
  }> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user)
        throw new UserNotFoundException(`User with email ${email} not found`);
      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (!isPasswordMatching) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
        userId: user.id.toString(),
      };
    } catch (error) {
      const message = `Error: ${error.message}, Stack: ${error.stack}, Code: ${error.code}`;
      this.logger.error(message);
      throw error;
    }
  }
}
