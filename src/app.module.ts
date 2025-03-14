import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from '@app/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PromptModule } from './entities/prompt/prompt.module';
import { LlmModule } from './llm-model/llm.module';
import { InvokerModule } from './sanitizers/invoker.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CachingModule } from '@app/cache';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    CachingModule,
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
