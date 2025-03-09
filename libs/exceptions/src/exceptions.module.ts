import { Module } from '@nestjs/common';
import { UserNotFoundException, FailedPromptCreation } from './';

@Module({
  providers: [UserNotFoundException, FailedPromptCreation],
  exports: [UserNotFoundException, FailedPromptCreation],
})
export class ExceptionsModule {}
