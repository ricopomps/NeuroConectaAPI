import { prisma } from "../../shared/prisma";
import { StudentRepository } from "./student.repository";

export class StudentService {
  private readonly studentRepo = new StudentRepository();

  async createStudent(
    userId: string,
    institutionId: string,
    name: string,
    birthDate: Date,
    segment?: string,
  ) {
    if (!name) {
      throw new Error("Student name is required");
    }

    return this.studentRepo.create(name, institutionId, birthDate, segment);
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

  async getStudentById(
    userId: string,
    institutionId: string,
    studentId: string,
  ) {
    const membership = await prisma.institutionUser.findFirst({
      where: {
        institutionId,
        userId,
      },
    });

    if (!membership) {
      throw new Error("Accesso negado");
    }

    const student = await this.studentRepo.findById(studentId, true);

    if (!student) {
      throw new Error("Aluno não encontrado");
    }

    return student;
  }

  async addStudentFile(
    userId: string,
    institutionId: string,
    studentId: string,
    fileName: string,
    fileUrl: string,
  ) {
    if (!fileName || !fileUrl) {
      throw new Error("Nome e URL do arquivo são obrigatórios");
    }

    const membership = await prisma.institutionUser.findFirst({
      where: {
        institutionId,
        userId,
      },
    });

    if (!membership) {
      throw new Error("Acceso negado");
    }

    const student = await this.studentRepo.findById(studentId);

    if (!student) {
      throw new Error("Aluno não encontrado");
    }

    if (student.institutionId !== institutionId) {
      throw new Error("Aluno não encontrado");
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
      throw new Error("Aluno não encontrado");
    }

    if (student.institutionId !== institutionId) {
      throw new Error("Aluno não encontrado");
    }

    return this.studentRepo.getFiles(studentId, take, skip);
  }

  async updateStudent(
    userId: string,
    institutionId: string,
    studentId: string,
    name?: string,
    birthDate?: Date,
    segment?: string,
  ) {
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
      throw new Error("Aluno não encontrado");
    }

    if (student.institutionId !== institutionId) {
      throw new Error("Aluno não encontrado");
    }

    const updatedName = name?.trim();
    if (updatedName !== undefined && !updatedName) {
      throw new Error("Student name is required");
    }

    return this.studentRepo.update(studentId, {
      name: updatedName,
      birthDate,
      segment,
    });
  }
}
