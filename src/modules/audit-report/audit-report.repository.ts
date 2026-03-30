import moment from "moment";
import { prisma } from "../../shared/prisma";
import { AiProviders } from "../../constants/ai-constants/ai-providers";
import { AiFeature } from "../../generated/prisma/enums";

export class AiAuditReportFiltersDto {
  aiProvider?: AiProviders;
  model?: string;
  dateFrom?: Date;
  dateUntil?: Date;
  userName?: string;
  feature?: AiFeature;
}

export type AiAuditTokenResponse = {
  input: number;
  output: number;
};

export type CreateAiAuditLog = {
  aiProvider: AiProviders;
  model: string;
  feature: AiFeature;
  userId: string;
  tokenInputQty: number;
  tokenOutputQty: number;
  imagesQty: number;
};

export class AuditReportRepository {
  async getAuditReportData(
    filters: AiAuditReportFiltersDto,
    page = 1,
    size = 10,
  ) {
    const where = this.applyFilters(filters);

    return prisma.auditLog.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: size,
      skip: (page - 1) * size,
    });
  }

  async getTokenInfo(
    filters: AiAuditReportFiltersDto,
  ): Promise<AiAuditTokenResponse> {
    const where = this.applyFilters(filters);

    const totals = await prisma.auditLog.aggregate({
      _sum: {
        tokenInputQty: true,
        tokenOutputQty: true,
      },
      where,
    });

    return {
      input: totals._sum.tokenInputQty ?? 0,
      output: totals._sum.tokenOutputQty ?? 0,
    };
  }

  private applyFilters(filters: AiAuditReportFiltersDto) {
    const { aiProvider, model, dateFrom, dateUntil, userName, feature } =
      filters;
    const where: any = {};

    if (aiProvider) {
      where.aiProvider = aiProvider;
    }

    if (feature) {
      where.feature = feature;
    }

    if (model) {
      where.model = {
        contains: model,
        mode: "insensitive",
      };
    }

    if (userName) {
      where.user = {
        name: {
          contains: userName,
          mode: "insensitive",
        },
      };
    }

    if (dateFrom) {
      where.createdAt = { gte: dateFrom };
    }

    if (dateUntil) {
      where.createdAt = {
        lte: moment.utc(dateUntil).endOf("day").toDate(),
        gte: dateFrom
          ? moment.utc(dateFrom).startOf("day").toDate()
          : new Date(2026, 1, 1),
      };
    }

    return where;
  }

  async saveAuditLog(data: CreateAiAuditLog) {
    return prisma.auditLog.create({ data });
  }
}
