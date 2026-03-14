import { AiFeature } from "../../generated/prisma/enums";

export const TreatedAiFeatures = [
  {
    name: 'Gerar PAEE',
    value: AiFeature.GENERATE_PAEE,
  },
  {
    name: 'Resumir Documentos',
    value: AiFeature.SUMMARIZE_TEXT,
  },
];
