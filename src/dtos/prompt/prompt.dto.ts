import { IsNotEmpty, IsString } from 'class-validator';

export class PromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
