import { prisma } from "../../shared/prisma";

export class StudentRepository {
  async create(
    name: string,
    institutionId: string,
    birthDate: Date,
    segment?: string,
  ) {
    return prisma.student.create({
      data: {
        name,
        institutionId,
        birthDate,
        segment: segment?.trim() || null,
      },
    });
  }

  async update(
    studentId: string,
    data: {
      name?: string;
      birthDate?: Date;
      segment?: string | null;
    },
  ) {
    return prisma.student.update({
      where: { id: studentId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.birthDate !== undefined ? { birthDate: data.birthDate } : {}),
        ...(data.segment !== undefined ? { segment: data.segment?.trim?.() || null } : {}),
      },
    });
  }

  async findByInstitution(institutionId: string) {
    return prisma.student.findMany({
      where: { institutionId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(studentId: string, includeCases = false) {
    return prisma.student.findUnique({
      where: { id: studentId },
      include: includeCases
        ? { caseStudies: { include: { student: true } } }
        : undefined,
    });
  }

  async addFile(studentId: string, name: string, url: string) {
    return await prisma.studentFile.create({
      data: {
        studentId,
        name,
        url,
      },
    });
  }

  async getFiles(studentId: string, take: number, skip: number) {
    const [files, count] = await Promise.all([
      prisma.studentFile.findMany({
        where: { studentId },
        take,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.studentFile.count({ where: { studentId } }),
    ]);

    return { files, count };
  }
}
