import { CachingService } from '@app/cache';
import { FailedPromptCreation, SanitizeException } from '@app/exceptions';
import { Injectable, Logger } from '@nestjs/common';
import { ModelSanitizedResponseDto } from 'src/dtos/prompt/model-sanitized-response.dto';
import { PromptDto } from 'src/dtos/prompt/prompt.dto';
import { LlmService } from 'src/llm-model/llm.service';
import { EmailSanitizerCommand } from 'src/sanitizers/email-sanitizer/email-sanitizer-command';
import { Invoker } from 'src/sanitizers/invoker';

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);

  constructor(
    private readonly invoker: Invoker,
    private readonly llmService: LlmService,
    private readonly cachingService: CachingService,
  ) {}

  /**
   * Creates a prompt by sanitizing the input, generating a response, and sanitizing the response.
   * Caches the result to avoid redundant processing of frequently used prompts.
   * @param promptDto - The prompt data transfer object containing the prompt text.
   * @returns The sanitized response including sanitized emails and prompt.
   */
  async createPrompt(promptDto: PromptDto): Promise<ModelSanitizedResponseDto> {
    const cacheKey = this.cachingService.generateCacheKey(promptDto.prompt);

    try {
      const cachedResponse =
        await this.cachingService.getCachedResponse(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Sanitize the prompt
      const sanitizedPrompt = await this.sanitizePrompt(promptDto.prompt);
      // Generate a response from the model
      const modelResponse = await this.generateModelResponse(
        sanitizedPrompt.sanitizedPrompt,
      );
      // Sanitize the model's response
      const finalResponse = await this.sanitizeModelResponse(
        modelResponse,
        sanitizedPrompt.emailsSanitized,
      );

      // Cache the final response
      await this.cachingService.cacheResponse(cacheKey, finalResponse);
      return finalResponse;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Sanitizes the input prompt.
   * @param prompt - The input prompt to be sanitized.
   * @returns The sanitized prompt and emails.
   */
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

  /**
   * Generates a response from the model based on the sanitized prompt.
   * @param sanitizedPrompt - The sanitized prompt text.
   * @returns The model's response.
   */
  private async generateModelResponse(
    sanitizedPrompt: string,
  ): Promise<string> {
    this.logger.log('Generating response');
    return this.llmService.generateResponse(sanitizedPrompt);
  }

  /**
   * Sanitizes the model's response.
   * @param modelResponse - The response generated by the model.
   * @param emails - The sanitized emails from the input prompt.
   * @returns The sanitized response including sanitized emails and prompt.
   */
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

  /**
   * Handles errors that occur during the prompt creation process.
   * @param error - The error that occurred.
   * @throws FailedPromptCreation - Throws a custom exception with the error message and stack trace.
   */
  private handleError(error: any): never {
    const message = `Error creating prompt: ${error.message}, stack: ${error.stack}`;
    this.logger.error(message);
    throw new FailedPromptCreation(message);
  }

  /**
   * Sanitizes the given prompt using the configured sanitizer.
   * @param prompt - The prompt to be sanitized.
   * @returns The sanitized result including sanitized emails and prompt.
   * @throws SanitizeException - Throws a custom exception if sanitization fails.
   */
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
