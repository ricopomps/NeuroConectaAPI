import { Assessment } from "../../generated/prisma/client";
import { prisma } from "../../shared/prisma";

export class AssessmentRepository {
  async create(name: string, content: string, studentId: string) {
    const assessment = await prisma.assessment.create({
      data: {
        name,
        content,
        studentId,
      },
    });

    return assessment;
  }

  async update(id: string, name?: string, content?: string): Promise<Assessment> {
    const assessment = await prisma.assessment.update({
      where: { id: id },
      data: {
        name,
        content,
      },
    });
    return assessment;
  }

  async findByStudent(studentId: string) {
    return prisma.assessment.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  }
}
