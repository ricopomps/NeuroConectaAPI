import { prisma } from "../../shared/prisma";
import { CaseStudyInput } from "./case-study.types";

export class CaseStudyRepository {
  async create(data: CaseStudyInput & { studentId: string }) {
    return prisma.caseStudy.create({
      data,
    });
  }

  async findByStudentId(studentId: string) {
    return prisma.caseStudy.findFirst({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: CaseStudyInput) {
    return prisma.caseStudy.update({
      where: { id },
      data,
    });
  }
}
