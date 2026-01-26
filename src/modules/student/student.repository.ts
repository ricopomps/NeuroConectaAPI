import { prisma } from "../../shared/prisma";

export class StudentRepository {
  async create(name: string, institutionId: string, birthDate: Date) {
    return prisma.student.create({
      data: {
        name,
        institutionId,
        birthDate,
      },
    });
  }

  async findByInstitution(institutionId: string) {
    return prisma.student.findMany({
      where: { institutionId },
      orderBy: { createdAt: "desc" },
    });
  }
}
