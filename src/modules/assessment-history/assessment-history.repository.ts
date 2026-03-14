import { prisma } from "../../shared/prisma";
import { PrismaClient, Prisma, AssessmentHistory } from "../../generated/prisma/client";


export class AssessmentHistoryRepository {
  async create(
    content: string,
    assessmentId: string,
    prismaTx?: PrismaClient | Prisma.TransactionClient,
  ): Promise<AssessmentHistory>{
    const repo = prismaTx || prisma;
    const assessmentHistory = await repo.assessmentHistory.create({
      data: {
        content,
        assessmentId,
      },
    });

    return assessmentHistory;
  }
}
