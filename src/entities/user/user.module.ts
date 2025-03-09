import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from '@app/prisma';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
