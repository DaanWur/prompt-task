import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from '@app/auth';
import { ConfigModule } from '@nestjs/config';
import { PromptModule } from './entities/prompt/prompt.module';
import { LlmModule } from './llm-model/llm.module';
import { InvokerModule } from './sanitizers/invoker.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { CachingModule } from '@app/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<CacheModuleOptions>({
      isGlobal: true,
      ttl: 3600, // default cache time-to-live in seconds
      max: 100, // maximum number of items in cache
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
