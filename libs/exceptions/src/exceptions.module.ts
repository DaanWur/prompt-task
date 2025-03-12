import { Module } from '@nestjs/common';
import {
  UserNotFoundException,
  FailedPromptCreation,
  SanitizeException,
} from './';

@Module({
  providers: [UserNotFoundException, FailedPromptCreation, SanitizeException],
  exports: [UserNotFoundException, FailedPromptCreation, SanitizeException],
})
export class ExceptionsModule {}
