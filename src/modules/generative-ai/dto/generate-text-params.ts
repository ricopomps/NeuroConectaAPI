import { Content } from './content';
import { AiMessagePossibleTypes } from '../../../constants/ai-constants/ai-message-possible-types';
import { AiFeatures } from '../../../constants/ai-constants/ai-features';

export type ResponseType = {
  type: AiMessagePossibleTypes;
}

export interface GenerateTextParams {
  contents: Content[];
  systemInstruction?: string;
  feature: AiFeatures;
  imagesQty?: number;
  responseType?: ResponseType;
}
