import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dtos/user/user.dto';
import { Public } from '@app/auth/guards/public.guard';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() data: UserDto) {
    try {
      this.logger.log('register');
      const user = await this.userService.register(data);
      return `User ${user.email} has been created`;
    } catch (error) {
      const message = `Error in register: ${error.message}, stack: ${error.stack}`;
      this.logger.error(message);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
