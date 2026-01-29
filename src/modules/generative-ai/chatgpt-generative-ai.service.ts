import {
  AZURE_OPENAI_DEPLOYMENT,
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_KEY,
  AZURE_OPENAI_MODEL,
} from "../../config/env";
import { AiMessagePossibleTypes } from "../../constants/ai-constants/ai-message-possible-types";
import { GenerateTextParams } from "./dto/generate-text-params";
import { GenerateTextResponse } from "./dto/generate-text-response";
import { GenerativeAiService } from "./generative-ai.service";
import { ContentRoles } from "../../constants/ai-constants/content-roles";
import { AiFeatures } from "../../constants/ai-constants/ai-features";
import { AiProviders } from "../../constants/ai-constants/ai-providers";
import { OpenAIContent } from "./dto/openai-content";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import { AzureOpenAI } from "openai";

const azureSearchEndpoint =
  process.env["AZURE_SEARCH_ENDPOINT"] || "<search endpoint>";
const azureSearchIndexName =
  process.env["AZURE_SEARCH_INDEX"] || "<search index>";

export class ChatGptAiService implements GenerativeAiService {
  constructor() {
    // private auditLogService: AuditLogService
  }

  async generateText(
    params: GenerateTextParams,
  ): Promise<GenerateTextResponse> {
    // const scope = "https://cognitiveservices.azure.com/.default";
    // const azureADTokenProvider = getBearerTokenProvider(
    //   new DefaultAzureCredential(),
    //   scope,
    // );
    // const deployment = "gpt-4-1106-preview";
    // const apiVersion = "2024-10-21";
    // const client = new AzureOpenAI({
    //   azureADTokenProvider,
    //   deployment,
    //   apiVersion,
    // });

    const contents = [];

    params.systemInstruction &&
      contents.push({
        role: ContentRoles.SYSTEM,
        content: params.systemInstruction,
      });

    // if (params.feature === AiFeatures.SUMMARIZE_TEXT) {
    //   // convert
    //   const contentChat: OpenAIContent = {
    //     role:
    //       params.contents[0].role === ContentRoles.USER ? ContentRoles.USER : ContentRoles.SYSTEM,
    //     content: [],
    //   };

    //   params.contents[0].parts.forEach((part) => {
    //     if (part.text) {
    //       contentChat.content.push({
    //         type: AiMessagePossibleTypes.TEXT,
    //         text: part.text,
    //       });
    //     } else {
    //       contentChat.content.push({
    //         type: AiMessagePossibleTypes.IMAGE_URL,
    //         imageUrl: {
    //           url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
    //         },
    //       });
    //     }
    //   });

    //   contents.push(contentChat);
    // } else {
    //   contents.push({
    //     role:
    //       params.contents[0].role === ContentRoles.USER ? ContentRoles.USER : ContentRoles.SYSTEM,
    //     content: params.contents[0].parts[0].text,
    //   });
    // }

    // ________________________________________________________________________________

    // Cria cliente AzureOpenAI
    try {
      const client = new AzureOpenAI({
        endpoint: AZURE_OPENAI_ENDPOINT,
        apiKey: AZURE_OPENAI_KEY,
        apiVersion: AZURE_OPENAI_MODEL,
      });

      // Mensagens no formato de chat (system + user)
      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Fale sobre feminicídio" },
      ];

      // Requisição de chat completion
      const response = await client.chat.completions.create({
        model: AZURE_OPENAI_DEPLOYMENT || "",
        messages,
        max_tokens: 800,
      });

      // Pega a primeira resposta gerada
      const answer = response.choices[0]?.message?.content ?? "";
      return {
        text: answer,
        provider: AiProviders.OPEN_AI,
        model: AZURE_OPENAI_MODEL || "",
      };
    } catch (err) {
      console.error("Erro ao chamar Azure OpenAI:", err);
      throw err;
    }

    // ________________________________________________________________________________

    // const result = await client.chat.completions.create({
    //   stream: false,
    //   messages: [
    //     {
    //       role: "user",
    //       content: "O que é feminicídio?",
    //     },
    //   ],
    //   max_tokens: 128,
    //   model: "",
    //   data_sources: [
    //     {
    //       type: "azure_search",
    //       parameters: {
    //         endpoint: azureSearchEndpoint,
    //         index_name: azureSearchIndexName,
    //         authentication: {
    //           type: "system_assigned_managed_identity",
    //         },
    //       },
    //     },
    //   ],
    // });

    // // await this.auditLogService.saveRequest(
    // //   AiProviders.OPEN_AI,
    // //   params.feature,
    // //   result.usage.promptTokens,
    // //   result.usage.completionTokens,
    // //   params.imagesQty || 0,
    // //   AZURE_OPENAI_MODEL || '',
    // // );

    // return {
    //   text: result.choices[0].message.content,
    //   provider: AiProviders.OPEN_AI,
    //   model: AZURE_OPENAI_MODEL || "",
    // };
  }
}
