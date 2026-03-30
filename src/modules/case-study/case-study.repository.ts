import { prisma } from "../../shared/prisma";

export class CaseStudyRepository {
  async create(data: any) {
    return prisma.caseStudy.create({
      data,
    });
  }

  async findByStudentId(studentId: string) {
    return prisma.caseStudy.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: any) {
    return prisma.caseStudy.update({
      where: { id },
      data,
    });
  }
}
