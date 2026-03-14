import { Assessment, Prisma, PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../../shared/prisma";

export class AssessmentRepository {
  async create(name: string, content: string, studentId: string): Promise<Assessment> {
    const assessment = await prisma.assessment.create({
      data: {
        name,
        content,
        studentId,
      },
    });

    return assessment;
  }

  async update(id: string, name?: string, content?: string, prismaTx?: PrismaClient | Prisma.TransactionClient): Promise<Assessment> {
    const repo = prismaTx || prisma;
    const assessment = await repo.assessment.update({
      where: { id: id },
      data: {
        name,
        content,
      },
    });
    return assessment;
  }

  async findById(id: string): Promise<Assessment> {
    return prisma.assessment.findUniqueOrThrow({ where: { id } });
  }

  async findByStudent(studentId: string): Promise<Assessment[]> {
    return prisma.assessment.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  }
}
