import { Logger } from '@nestjs/common';
import { SanitizeCommand } from '../sanitize-command.interface';
import { PromptAnswerDto } from 'src/dtos/prompt/prompt-answer.dto';

/**
 * Command to sanitize emails from a given prompt.
 * Implements the SanitizeCommand interface.
 */
export class EmailSanitizerCommand implements SanitizeCommand {
  private readonly logger = new Logger(EmailSanitizerCommand.name);

  /**
   * Executes the email sanitizer command.
   * @param prompt - The input string potentially containing emails.
   * @returns A PromptAnswerDto containing the sanitized prompt and extracted emails.
   */
  public execute(prompt: string): PromptAnswerDto {
    this.logger.log('Executing email sanitizer command');
    return this.replaceEmails(prompt);
  }

  /**
   * Replaces all email addresses in the given prompt with a placeholder and logs the replaced emails.
   * @param prompt - The input string potentially containing emails.
   * @returns A PromptAnswerDto containing the sanitized prompt and extracted emails.
   */
  private replaceEmails(prompt: string): PromptAnswerDto {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const result: PromptAnswerDto = {
      emails: [] as string[],
      sanitizedPrompt: prompt,
    };
    result.sanitizedPrompt = result.sanitizedPrompt.replace(
      emailRegex,
      (match) => {
        result.emails.push(match);
        return 'xxx@my.email';
      },
    );
    this.logger.log(`Replaced emails: ${result.emails.join(', ')}`);
    return result;
  }
}
