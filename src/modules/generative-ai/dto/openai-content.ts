import { AiMessagePossibleTypes } from "../../../constants/ai-constants/ai-message-possible-types";
import { ContentRoles } from "../../../constants/ai-constants/content-roles";

export interface OpenAIContent {
    role: ContentRoles;
    content: OpenAIContentItem[];
}

export interface ImageContent {
    url: string;
}

export interface OpenAIContentItem {
    type: AiMessagePossibleTypes;
    text?: string;
    imageUrl?: ImageContent
}

