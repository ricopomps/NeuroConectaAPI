import { prisma } from "../../shared/prisma";
import { StudentRepository } from "./student.repository";

export class StudentService {
  private readonly studentRepo = new StudentRepository();

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

  async addStudentFile(
    userId: string,
    institutionId: string,
    studentId: string,
    fileName: string,
    fileUrl: string,
  ) {
    if (!fileName || !fileUrl) {
      throw new Error("fileName and fileUrl are required");
    }

    const membership = await prisma.institutionUser.findFirst({
      where: {
        institutionId,
        userId,
      },
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    const student = await this.studentRepo.findById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    if (student.institutionId !== institutionId) {
      throw new Error("Student does not belong to this institution");
    }

    return this.studentRepo.addFile(studentId, fileName, fileUrl);
  }

  async getFiles(
    institutionId: string,
    studentId: string,
    take: number,
    skip: number,
  ) {
    const student = await this.studentRepo.findById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    if (student.institutionId !== institutionId) {
      throw new Error("Student does not belong to this institution");
    }

    return this.studentRepo.getFiles(studentId, take, skip);
  }
}
