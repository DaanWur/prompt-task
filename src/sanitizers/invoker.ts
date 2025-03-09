import { Logger } from '@nestjs/common';
import { SanitizeCommand } from './sanitize-command.interface';
import { PromptAnswerDto } from 'src/dtos/prompt/prompt-answer.dto';

export class Invoker {
  private readonly logger = new Logger(Invoker.name);
  private emailSanitizer: SanitizeCommand;

  public setEmailSanitizer(command: SanitizeCommand): void {
    this.logger.log('Invoker: Setting email sanitizer command');
    this.emailSanitizer = command;
  }

  public sanitizePrompt(prompt: string): PromptAnswerDto {
    this.logger.log('Starting the email sanitization process');
    if (this.isCommand(this.emailSanitizer)) {
      return this.emailSanitizer.execute(prompt);
    }
  }

  private isCommand(object: any): object is SanitizeCommand {
    return (object as SanitizeCommand).execute !== undefined;
  }
}
