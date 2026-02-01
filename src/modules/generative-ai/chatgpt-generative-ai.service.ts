import {
  AZURE_OPENAI_DEPLOYMENT,
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_KEY,
  AZURE_OPENAI_MODEL,
} from "../../config/env";
import { GenerateTextParams } from "./dto/generate-text-params";
import { GenerateTextResponse } from "./dto/generate-text-response";
import { GenerativeAiService } from "./generative-ai.service";
import { ContentRoles } from "../../constants/ai-constants/content-roles";
import { AiFeatures } from "../../constants/ai-constants/ai-features";
import { AiProviders } from "../../constants/ai-constants/ai-providers";
import { AzureOpenAI } from "openai";

export class ChatGptAiService implements GenerativeAiService {
  constructor() {
    // private auditLogService: AuditLogService
  }

  async generateText(
    params: GenerateTextParams
  ): Promise<GenerateTextResponse> {
    if (params.feature === AiFeatures.SUMMARIZE_TEXT) {
      // // convert
      // const contentChat: OpenAIContent = {
      //   role:
      //     params.contents[0].role === ContentRoles.USER
      //       ? ContentRoles.USER
      //       : ContentRoles.SYSTEM,
      //   content: [],
      // };
      // params.contents[0].parts.forEach((part) => {
      //   if (part.text) {
      //     contentChat.content.push({
      //       type: AiMessagePossibleTypes.TEXT,
      //       text: part.text,
      //     });
      //   } else {
      //     contentChat.content.push({
      //       type: AiMessagePossibleTypes.IMAGE_URL,
      //       imageUrl: {
      //         url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
      //       },
      //     });
      //   }
      // });
      // contents.push(contentChat);
    }

    try {
      if (!params.systemInstruction) {
        throw new Error("Necessário passar uma instrunção");
      }

      const options = {
        endpoint: AZURE_OPENAI_ENDPOINT,
        apiKey: AZURE_OPENAI_KEY,
        deployment: AZURE_OPENAI_DEPLOYMENT,
        apiVersion: AZURE_OPENAI_MODEL,
      };

      const client = new AzureOpenAI(options);

      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: params.systemInstruction },
        ],
        max_completion_tokens: 16384,
        model: AZURE_OPENAI_DEPLOYMENT || "",
      });

      // await this.auditLogService.saveRequest(
      //   AiProviders.OPEN_AI,
      //   params.feature,
      //   result.usage.promptTokens,
      //   result.usage.completionTokens,
      //   params.imagesQty || 0,
      //   AZURE_OPENAI_MODEL || '',
      // );

      return {
        text: response.choices[0].message.content,
        provider: AiProviders.OPEN_AI,
        model: AZURE_OPENAI_MODEL || "",
      };
    } catch (err) {
      console.error("Erro ao chamar Azure OpenAI:", err);
      throw err;
    }
  }
}
