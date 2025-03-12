import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptDto } from 'src/dtos/prompt/prompt.dto';
import { LlmService } from 'src/llm-model/llm.service';
import { ModelSanitizedResponseDto } from 'src/dtos/prompt/model-sanitized-response.dto';

@Controller('prompt')
export class PromptController {
  private readonly logger = new Logger(PromptController.name);
  constructor(
    private readonly promptService: PromptService,
    private readonly llmService: LlmService,
  ) {}

  @Post()
  async createPrompt(
    @Body() promptDto: PromptDto,
  ): Promise<ModelSanitizedResponseDto> {
    try {
      this.logger.log('Sanitizing prompt');
      const promptAnswerDto = await this.promptService.sanitize(
        promptDto.prompt,
      );
      this.logger.log('Generating response');
      const modelAnswer = await this.llmService.generateResponse(
        promptAnswerDto.sanitizedPrompt,
      );
      this.logger.log('Sanitizing model response');
      const response = await this.promptService.sanitize(modelAnswer);
      return {
        emailsSanitized: promptAnswerDto.emails,
        sanitizedPrompt: response.sanitizedPrompt,
      };
    } catch (error) {
      const message = `Error creating prompt: ${error.message}, stack: ${error.stack}`;
      this.logger.error(message);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
