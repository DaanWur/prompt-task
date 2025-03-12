import { Logger } from '@nestjs/common';
import { SanitizeCommand } from './sanitize-command.interface';
import { PromptAnswerDto } from 'src/dtos/prompt/prompt-answer.dto';

export class Invoker {
  private readonly logger = new Logger(Invoker.name);
  private sanitizer: SanitizeCommand;

  public setSanitizer(command: SanitizeCommand): void {
    this.logger.log(`Invoker: Setting sanitizer command`);
    this.sanitizer = command;
  }

  public sanitizePrompt(prompt: string): PromptAnswerDto {
    this.logger.log('Starting the sanitization process');
    if (this.isCommand(this.sanitizer)) {
      return this.sanitizer.execute(prompt);
    }
  }

  private isCommand(object: any): object is SanitizeCommand {
    return (object as SanitizeCommand).execute !== undefined;
  }
}
