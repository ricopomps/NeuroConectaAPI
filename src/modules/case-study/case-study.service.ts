import { prisma } from "../../shared/prisma";
import { CaseStudyRepository } from "./case-study.repository";

export class CaseStudyService {
  private readonly caseStudyRepo = new CaseStudyRepository();

  async createCaseStudy(
    userId: string,
    institutionId: string,
    studentId: string,
    data: any,
  ) {
    // Check if user has access to the institution
    const membership = await prisma.institutionUser.findFirst({
      where: {
        institutionId,
        userId,
      },
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    // Check if student exists and belongs to the institution
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        institutionId,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Check if case study already exists for this student
    const existing = await this.caseStudyRepo.findByStudentId(studentId);
    if (existing) {
      throw new Error("Case study already exists for this student");
    }

    return this.caseStudyRepo.create({
      studentId,
      ...data,
    });
  }

  async getCaseStudy(userId: string, institutionId: string, studentId: string) {
    // Check access
    const membership = await prisma.institutionUser.findFirst({
      where: {
        institutionId,
        userId,
      },
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    // Check student
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        institutionId,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return this.caseStudyRepo.findByStudentId(studentId);
  }

  async updateCaseStudy(
    userId: string,
    institutionId: string,
    studentId: string,
    data: any,
  ) {
    // Check access
    const membership = await prisma.institutionUser.findFirst({
      where: {
        institutionId,
        userId,
      },
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    // Check student
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        institutionId,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Get existing case study
    const existing = await this.caseStudyRepo.findByStudentId(studentId);
    if (!existing) {
      throw new Error("Case study not found");
    }

    return this.caseStudyRepo.update(existing.id, data);
  }
}
