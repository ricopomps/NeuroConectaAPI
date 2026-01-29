import { GOOGLE_GENERATIVE_AI_API_KEY, GOOGLE_GENERATIVE_AI_MODEL } from "../../config/env";
import { AiProviders } from "../../constants/ai-constants/ai-providers";
import { GenerateTextParams } from "./dto/generate-text-params";
import { GenerateTextResponse } from "./dto/generate-text-response";
import { GenerativeAiService } from "./generative-ai.service";
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export class GoogleGenerativeAiService implements GenerativeAiService {
  private generativeAi: GoogleGenerativeAI;
  constructor(
    // private auditLogService: AuditLogService,
  ) {
    this.generativeAi = new GoogleGenerativeAI(GOOGLE_GENERATIVE_AI_API_KEY || '');
  }

  private get model(): GenerativeModel {
    return this.generativeAi.getGenerativeModel({ model: GOOGLE_GENERATIVE_AI_MODEL || '' });
  }

  async generateText(params: GenerateTextParams): Promise<GenerateTextResponse> {
    const { contents, systemInstruction, imagesQty } = params;
    const { response } = await this.model.generateContent({
      contents,
      systemInstruction,
      generationConfig: {
        candidateCount: 1,
      },
    });
    // await this.auditLogService.saveRequest(
    //   AiProviders.GOOGLE,
    //   params.feature,
    //   response.usageMetadata.promptTokenCount,
    //   response.usageMetadata.candidatesTokenCount,
    //   imagesQty || 0,
    //   GOOGLE_GENERATIVE_AI_MODEL || ''
    // );
    console.log('Vertex AI usage metadata', { usage: response.usageMetadata });
    const candidate = response.candidates && response.candidates[0];
    const generatedText = candidate?.content?.parts[0].text || '';
    return {
      text: generatedText,
      provider: AiProviders.GOOGLE,
      model: GOOGLE_GENERATIVE_AI_MODEL || '',
    };
  }
}
