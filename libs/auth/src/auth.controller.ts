import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guards/public.guard';
import { UserLoginDto } from 'src/dtos/user/user-login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: UserLoginDto) {
    try {
      return await this.authService.signIn(signInDto.email, signInDto.password);
    } catch (error) {
      const message = `Error: ${error.message}, Stack: ${error.stack}, Code: ${error.code}`;
      this.logger.error(message);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
