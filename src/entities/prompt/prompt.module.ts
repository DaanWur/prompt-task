import { Module } from '@nestjs/common';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';
import { LlmModule } from 'src/llm-model/llm.module';
import { InvokerModule } from 'src/sanitizers/invoker.module';

@Module({
  imports: [LlmModule, InvokerModule],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule {}
