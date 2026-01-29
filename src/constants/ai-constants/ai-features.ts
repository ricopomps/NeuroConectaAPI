export enum AiFeatures {
  GENERATE_PAEE = 'GENERATE_PAEE',
  SUMMARIZE_TEXT = 'SUMMARIZE_TEXT',
}

export const TreatedAiFeatures = [
  {
    name: 'Gerar PAEE',
    value: AiFeatures.GENERATE_PAEE,
  },
  {
    name: 'Resumir Documentos',
    value: AiFeatures.SUMMARIZE_TEXT,
  },
];
