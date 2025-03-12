import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class LlmService {
  private llama: any;
  private model: any;
  private context: any;
  private session: any;
  constructor(private readonly configService: ConfigService) {}

  private async onModuleInit() {
    const { getLlama, LlamaChatSession } = await this.myLogic();
    this.llama = await getLlama();
    this.model = await this.llama.loadModel({
      modelPath: path.join(
        '/Users/daniel.w/.node-llama-cpp/',
        'models',
        this.configService.getOrThrow('LLM_NAME'),
      ),
    });
    this.context = await this.model.createContext();
    this.session = new LlamaChatSession({
      contextSequence: this.context.getSequence(),
    });
  }

  private async myLogic() {
    const nlc: { getLlama: any; LlamaChatSession: any } = await Function(
      'return import("node-llama-cpp")',
    )();
    const { getLlama, LlamaChatSession } = nlc;
    return { getLlama, LlamaChatSession };
  }

  async generateResponse(message: string) {
    try {
      const response = await this.session.prompt(message);
      return response;
    } catch (error) {
      const message = `Error: ${error.message}, Stack: ${error.stack}, Code: ${error.code}`;
      throw new Error(message);
    }
  }
}
