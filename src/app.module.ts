import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from '@app/auth';
import { ConfigModule } from '@nestjs/config';
import { PromptModule } from './entities/prompt/prompt.module';
import { LlmModule } from './llm-model/llm.module';
import { InvokerModule } from './sanitizers/invoker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PromptModule,
    LlmModule,
    InvokerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
