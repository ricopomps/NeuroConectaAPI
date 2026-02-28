import { Request, Response } from "express";
import { AssessmentService } from "./assessment.service";

export class AssessmentController {
  private readonly assessmentService = new AssessmentService();

  async generateDoc(req: Request, res: Response) {
    const files = req.body?.files;
    const response = await this.assessmentService.generateDoc(files);
    console.log("CHEGOU AQUI, DE BOAÇA");
    return res.json({ response });
  }

  async create(req: Request, res: Response) {
    try {
      const { name, content, studentId } = req.body;
      const downloadUrl = await this.assessmentService.createAssessment(
        name,
        content,
        studentId,
      );
      return res.json(downloadUrl);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { content, name } = req.body;
      const { assessmentId } = req.params;
      const downloadUrl = await this.assessmentService.updateAssessment(
        assessmentId as string,
        name,
        content,
      );
      return res.json(downloadUrl);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { studentId } = req.params;

      const assessments = await this.assessmentService.listAssessments(
        studentId as string,
      );

      return res.json(assessments);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async download(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const pdf = await this.assessmentService.downloadDocument(
        token as string,
      );
      res.contentType('pdf');
      res.send(pdf)
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
