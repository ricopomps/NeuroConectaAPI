import { Request, Response } from "express";
import { StudentService } from "./student.service";

export class StudentController {
  private readonly studentService = new StudentService();

  async create(req: Request, res: Response) {
    try {
      const { institutionId } = req.params;
      const { name, birthDate } = req.body;

      const student = await this.studentService.createStudent(
        req.userId!,
        institutionId as string,
        name,
        birthDate,
      );

      return res.status(201).json(student);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { institutionId } = req.params;

      const students = await this.studentService.listStudents(
        req.userId!,
        institutionId as string,
      );

      return res.json(students);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getStudent(req: Request, res: Response) {
    try {
      const { institutionId, studentId } = req.params;

      const student = await this.studentService.getStudentById(
        req.userId!,
        institutionId as string,
        studentId as string,
      );

      return res.json(student);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async addFile(req: Request, res: Response) {
    try {
      const { institutionId, studentId } = req.params;
      const { fileName, fileUrl } = req.body;

      const updatedStudent = await this.studentService.addStudentFile(
        req.userId!,
        institutionId as string,
        studentId as string,
        fileName as string,
        fileUrl as string,
      );

      return res.json(updatedStudent);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listStudentFiles(req: Request, res: Response) {
    try {
      const { institutionId, studentId } = req.params;
      const { take, skip } = req.query;

      const studentFiles = await this.studentService.getFiles(
        institutionId as string,
        studentId as string,
        take ? Number(take) : 10,
        skip ? Number(skip) : 0,
      );

      return res.json(studentFiles);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
