import { prisma } from "../../shared/prisma";
import { StudentRepository } from "./student.repository";

export class StudentService {
  private studentRepo = new StudentRepository();

  async createStudent(
    userId: string,
    institutionId: string,
    name: string,
    birthDate: Date,
  ) {
    if (!name) {
      throw new Error("Student name is required");
    }

    return this.studentRepo.create(name, institutionId, birthDate);
  }

  async listStudents(userId: string, institutionId: string) {
    const membership = await prisma.institutionUser.findFirst({
      where: {
        institutionId,
        userId,
      },
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    return this.studentRepo.findByInstitution(institutionId);
  }
}
