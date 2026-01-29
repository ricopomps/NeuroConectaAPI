import { GenerativeAiService } from "../generative-ai/generative-ai.service";
import { GoogleGenerativeAiService } from "../generative-ai/google-generative-ai.service";
import { AiFeatures } from "../../constants/ai-constants/ai-features";
import { GenerateTextResponse } from "../generative-ai/dto/generate-text-response";
import { AI_SOURCE } from "../../config/env";
import { AI_SOURCE_OPEN_AI } from "../../constants/ai-constants/ai-source";
import { ChatGptAiService } from "../generative-ai/chatgpt-generative-ai.service";

export class AiTesterService {
  private generativeAiService: GenerativeAiService;

  constructor() {
    this.generativeAiService =
      AI_SOURCE?.toLowerCase() === AI_SOURCE_OPEN_AI
        ? new ChatGptAiService()
        : new GoogleGenerativeAiService();
  }

  async teste(text: string): Promise<GenerateTextResponse> {
    const response = await this.generativeAiService.generateText({
      contents: [],
      systemInstruction: text,
      feature: AiFeatures.GENERATE_PAEE,
    });
    return response;
  }

  async createUser() {
    return "ok";
  }
}
