import { FailedPromptCreation } from '@app/exceptions';
import { Injectable, Logger } from '@nestjs/common';
import { EmailSanitizerCommand } from 'src/sanitizers/email-sanitizer/email-sanitizer-command';
import { Invoker } from 'src/sanitizers/invoker';

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);
  constructor(private readonly invoker: Invoker) {}

  async createPrompt(prompt: string) {
    try {
      this.invoker.setEmailSanitizer(new EmailSanitizerCommand());

      return this.invoker.sanitizePrompt(prompt);
    } catch (error) {
      const message = `Error creating prompt: ${error.message}, stack: ${error.stack}`;
      this.logger.error(message);

      throw new FailedPromptCreation(error);
    }
  }
}
