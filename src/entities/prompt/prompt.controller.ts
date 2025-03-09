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

@Controller('prompt')
export class PromptController {
  private readonly logger = new Logger(PromptController.name);
  constructor(private readonly promptService: PromptService) {}

  @Post()
  async createPrompt(@Body() promptDto: PromptDto) {
    try {
      this.logger.log('Creating prompt');
      return this.promptService.createPrompt(promptDto.prompt);
    } catch (error) {
      this.logger.error(
        `Error creating prompt: ${error.message}, stack: ${error.stack}`,
      );
      throw new HttpException('Error creating prompt', HttpStatus.BAD_REQUEST);
    }
  }
}
