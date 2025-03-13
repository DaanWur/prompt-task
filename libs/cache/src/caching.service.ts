// filepath: /Users/daniel.w/Desktop/prompt/prompt-task/libs/cache/src/caching.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import createHash from 'create-hash';
import { ModelSanitizedResponseDto } from 'src/dtos/prompt/model-sanitized-response.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachingService {
  private readonly logger = new Logger(CachingService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Generates a unique cache key for the given prompt.
   * @param input - The input text.
   * @returns The generated cache key.
   */
  public generateCacheKey(input: string): string {
    return `stored_input_${createHash('md5').update(input).digest('hex')}`;
  }

  /**
   * Retrieves a cached response if it exists.
   * @param cacheKey - The key used to store the cached response.
   * @returns The cached response or null if not found.
   */
  public async getCachedResponse(
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

  /**
   * Caches the response to avoid redundant processing of frequently used prompts.
   * @param cacheKey - The key used to store the cached response.
   * @param response - The response to be cached.
   */
  public async cacheResponse(
    cacheKey: string,
    response: ModelSanitizedResponseDto,
  ): Promise<void> {
    this.logger.log(`Caching response with key: ${cacheKey}`);
    await this.cacheManager.set(cacheKey, response, 3600); // Cache for 1 hour
  }
}
