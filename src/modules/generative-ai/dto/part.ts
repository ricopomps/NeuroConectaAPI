export interface InlineContent {
    mimeType: string;
    data: string;
}

export interface TextPart {
    text: string;
    inlineData?: never;
}

export interface InlineDataPart {
    text?: never;
    inlineData: InlineContent;
}


export type Part = TextPart | InlineDataPart;


