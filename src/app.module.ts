import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from '@app/auth';
import { ConfigModule } from '@nestjs/config';
import { PromptModule } from './entities/prompt/prompt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PromptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
