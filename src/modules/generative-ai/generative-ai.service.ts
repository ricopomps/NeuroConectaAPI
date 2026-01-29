import { GenerateTextParams } from './dto/generate-text-params';
import { GenerateTextResponse } from './dto/generate-text-response';

export abstract class GenerativeAiService {
  abstract generateText(params: GenerateTextParams): Promise<GenerateTextResponse>;
}