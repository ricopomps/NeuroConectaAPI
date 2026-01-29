import { AiProviders } from "../../../constants/ai-constants/ai-providers";

export interface GenerateTextResponse {
  text: string | null;
  provider: AiProviders,
  model: string,
}
