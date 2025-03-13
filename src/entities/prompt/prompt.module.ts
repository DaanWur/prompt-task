import { Module } from '@nestjs/common';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';
import { LlmModule } from 'src/llm-model/llm.module';
import { InvokerModule } from 'src/sanitizers/invoker.module';
import { CachingModule } from '@app/cache';

@Module({
  imports: [LlmModule, InvokerModule, CachingModule],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule {}
