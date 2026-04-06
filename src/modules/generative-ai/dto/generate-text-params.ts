import { Content } from './content';
import { AiMessagePossibleTypes } from '../../../constants/ai-constants/ai-message-possible-types';
import { AiFeature } from '../../../generated/prisma/enums';

export type ResponseType = {
  type: AiMessagePossibleTypes;
}

export interface GenerateTextParams {
  contents: Content[];
  systemInstruction?: string;
  feature: AiFeature;
  imagesQty?: number;
  responseType?: ResponseType;
}
