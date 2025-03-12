import { FailedPromptCreation, SanitizeException } from '@app/exceptions';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ModelSanitizedResponseDto } from 'src/dtos/prompt/model-sanitized-response.dto';
import { PromptDto } from 'src/dtos/prompt/prompt.dto';
import { LlmService } from 'src/llm-model/llm.service';
import { EmailSanitizerCommand } from 'src/sanitizers/email-sanitizer/email-sanitizer-command';
import { Invoker } from 'src/sanitizers/invoker';

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly invoker: Invoker,
    private readonly llmService: LlmService,
  ) {}

  async createPrompt(promptDto: PromptDto): Promise<ModelSanitizedResponseDto> {
    const cacheKey = `stored_prompt_${promptDto.prompt}`;

    try {
      const cachedResponse = await this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }

      const sanitizedPrompt = await this.sanitizePrompt(promptDto.prompt);
      const modelResponse = await this.generateModelResponse(
        sanitizedPrompt.sanitizedPrompt,
      );
      const finalResponse = await this.sanitizeModelResponse(
        modelResponse,
        sanitizedPrompt.emailsSanitized,
      );

      await this.cacheResponse(cacheKey, finalResponse);
      return finalResponse;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async getCachedResponse(
    cacheKey: string,
  ): Promise<ModelSanitizedResponseDto | null> {
    const cachedResponse =
      await this.cacheManager.get<ModelSanitizedResponseDto>(cacheKey);
    if (cachedResponse) {
      this.logger.log('Returning cached response');
      return cachedResponse;
    }
    return null;
  }

  private async sanitizePrompt(
    prompt: string,
  ): Promise<ModelSanitizedResponseDto> {
    this.logger.log('Sanitizing prompt');
    const sanitizedResult = await this.sanitize(prompt);
    return {
      emailsSanitized: sanitizedResult.emails,
      sanitizedPrompt: sanitizedResult.sanitizedPrompt,
    };
  }

  private async generateModelResponse(
    sanitizedPrompt: string,
  ): Promise<string> {
    this.logger.log('Generating response');
    return this.llmService.generateResponse(sanitizedPrompt);
  }

  private async sanitizeModelResponse(
    modelResponse: string,
    emails: string[],
  ): Promise<ModelSanitizedResponseDto> {
    this.logger.log('Sanitizing model response');
    const response = await this.sanitize(modelResponse);
    return {
      emailsSanitized: [...emails, ...response.emails],
      sanitizedPrompt: response.sanitizedPrompt,
    };
  }

  private async cacheResponse(
    cacheKey: string,
    response: ModelSanitizedResponseDto,
  ): Promise<void> {
    await this.cacheManager.set(cacheKey, response, 3600); // Cache for 1 hour
  }

  private handleError(error: any): never {
    const message = `Error creating prompt: ${error.message}, stack: ${error.stack}`;
    this.logger.error(message);
    throw new FailedPromptCreation(message);
  }

  private async sanitize(prompt: string) {
    try {
      this.invoker.setSanitizer(new EmailSanitizerCommand());

      return this.invoker.sanitizePrompt(prompt);
    } catch (error) {
      const message = `Error sanitizing prompt: ${error.message}, stack: ${error.stack}`;
      this.logger.error(message);

      throw new SanitizeException(error);
    }
  }
}
