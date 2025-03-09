import { PromptAnswerDto } from 'src/dtos/prompt/prompt-answer.dto';

export interface SanitizeCommand {
  execute(prompt: string): PromptAnswerDto;
}
