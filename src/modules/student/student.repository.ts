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

  async findById(studentId: string) {
    return prisma.student.findUnique({
      where: { id: studentId },
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
