import { Logger } from '@nestjs/common';
import { SanitizeCommand } from '../sanitize-command.interface';
import { PromptAnswerDto } from 'src/dtos/prompt/prompt-answer.dto';

export class EmailSanitizerCommand implements SanitizeCommand {
  private readonly logger = new Logger(EmailSanitizerCommand.name);

  public execute(prompt: string): PromptAnswerDto {
    this.logger.log('Executing email sanitizer command');
    return this.replaceEmails(prompt);
  }

  private replaceEmails(prompt: string): PromptAnswerDto {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const result: PromptAnswerDto = {
      emails: [] as string[],
      prompt: prompt,
    };
    result.prompt = result.prompt.replace(emailRegex, (match) => {
      result.emails.push(match);
      return 'xxx@my.email';
    });
    this.logger.log(`Replaced emails: ${result.emails.join(', ')}`);
    return result;
  }
}
