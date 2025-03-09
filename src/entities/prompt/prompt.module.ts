import { Module } from '@nestjs/common';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';
import { Invoker } from 'src/sanitizers/invoker';

@Module({
  controllers: [PromptController],
  providers: [PromptService, Invoker],
})
export class PromptModule {}
