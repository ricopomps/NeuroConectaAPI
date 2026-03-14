import jwt from "jsonwebtoken";
import moment from "moment";
import { SELF_BASE_URL } from "../../config/env";
import { TreatedAiFeatures } from "../../constants/ai-constants/ai-features";
import { AiProviders } from "../../constants/ai-constants/ai-providers";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../constants/ai-constants/keys";
import { AiFeature } from "../../generated/prisma/enums";
import { toExcel } from "../../utils";
import {
  AiAuditReportFiltersDto,
  AuditReportRepository,
} from "./audit-report.repository";

export class AuditLogService {
  private readonly auditReportRepository = new AuditReportRepository();

  async getAuditReport(
    filters: AiAuditReportFiltersDto,
    page?: number,
    size?: number,
  ) {
    const auditReportData = await this.auditReportRepository.getAuditReportData(
      filters,
      page,
      size,
    );
    const tokenData = await this.auditReportRepository.getTokenInfo(filters);
    const totalTokenInputQty = tokenData.input;
    const totalTokenOutputQty = tokenData.output;

    return {
      data: auditReportData,
      totalTokenInputQty,
      totalTokenOutputQty,
      //   excelUrl: await this.getExcelUrl(filters),
    };
  }

  async downloadExcel(token: string) {
    const filters = this.decodeJwt(token);
    return this.getExcel(filters);
  }

  private decodeJwt(token: string): AiAuditReportFiltersDto {
    const { sub: data } = jwt.verify(token, PUBLIC_KEY) as {
      sub: AiAuditReportFiltersDto;
    };
    return data;
  }

  private async getExcelUrl(filters: AiAuditReportFiltersDto) {
    const token = jwt.sign({ filters }, PRIVATE_KEY, {
      expiresIn: "1h",
      algorithm: "RS256",
    });

    return encodeURI(
      `${SELF_BASE_URL}/audit-report/excel/${token}/relatorio_auditoria_da_ia.xlsx`,
    );
  }

  async getExcel(filters: AiAuditReportFiltersDto) {
    try {
      const { data } = await this.getAuditReport(filters);
      const result = data.map((item) => {
        return {
          ["Provedor IA"]: item.aiProvider || "-",
          ["Modelo"]: item.model || "-",
          ["Data e Hora"]:
            moment(item.createdAt).format("DD/MM/yyyy HH:mm") || "-",
          ["Funcionalidade"]: this.formatFeature(item.feature) || "-",
          ["Usuário"]: item.user?.name || "-",
          ["Qtde tokens de entrada"]: item.tokenInputQty || "-",
          ["Qtde tokens de saída"]: item.tokenOutputQty || "-",
          ["Qtde de imagens"]: item.imagesQty || "-",
        };
      });
      return toExcel(
        result,
        "Auditoria da IA",
        "Relatório de Auditoria do consumo da Inteligência Artificial",
        true,
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  private formatFeature(featureValue: AiFeature) {
    return (
      TreatedAiFeatures.find((feat) => feat.value === featureValue)?.name ||
      "Geral"
    );
  }

  async saveRequest(
    aiProvider: AiProviders,
    feature: AiFeature,
    tokenInputQty: number,
    tokenOutputQty: number,
    imagesQty: number,
    model: string,
  ) {
    // TODO LUIZ - Obter o usuário logado
    await this.auditReportRepository.saveAuditLog({
      aiProvider,
      feature,
      tokenInputQty,
      tokenOutputQty,
      imagesQty,
      model,
      userId: "0218f043-a9aa-4a85-91d0-d6f7ad859466",
    });
  }
}
