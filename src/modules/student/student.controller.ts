import { Request, Response } from "express";
import { StudentService } from "./student.service";

export class StudentController {
  private service = new StudentService();

  async create(req: Request, res: Response) {
    try {
      const { institutionId } = req.params;
      const { name, birthDate } = req.body;

      const student = await this.service.createStudent(
        req.userId!,
        institutionId as string,
        name,
        birthDate,
      );

      return res.status(201).json(student);
    } catch (error: any) {
      return res.status(403).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { institutionId } = req.params;

      const students = await this.service.listStudents(
        req.userId!,
        institutionId as string,
      );

      return res.json(students);
    } catch (error: any) {
      return res.status(403).json({ error: error.message });
    }
  }
}
