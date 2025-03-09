import { PrismaService } from '@app/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDto } from 'src/dtos/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(userDto: UserDto): Promise<User> {
    try {
      this.logger.log(`register: ${userDto.email}`);
      const saltRounds = 10;
      userDto.password = await bcrypt.hash(userDto.password, saltRounds);
      return this.prisma.user.create({ data: userDto });
    } catch (error) {
      const message = `Error in register: ${error.message}, stack: ${error.stack}`;
      this.logger.error(message);

      //TODO: throw custom error
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      const message = `Error in findOneByEmail: ${error.message}, stack: ${error.stack}`;
      this.logger.error(message);
      // TODO: throw custom error
      throw error;
    }
  }
}
