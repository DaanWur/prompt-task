import { Module } from '@nestjs/common';
import {
  UserNotFoundException,
  FailedPromptCreation,
  SanitizeException,
  RegistrationException,
} from './';

@Module({
  providers: [
    UserNotFoundException,
    FailedPromptCreation,
    SanitizeException,
    RegistrationException,
  ],
  exports: [
    UserNotFoundException,
    FailedPromptCreation,
    SanitizeException,
    RegistrationException,
  ],
})
export class ExceptionsModule {}
