import { Request, Response } from "express";
import { CaseStudyService } from "./case-study.service";

export class CaseStudyController {
  private readonly caseStudyService = new CaseStudyService();

  async create(req: Request, res: Response) {
    try {
      const { institutionId, studentId } = req.params;
      const data = req.body;

      const caseStudy = await this.caseStudyService.createCaseStudy(
        req.userId!,
        institutionId as string,
        studentId as string,
        data,
      );

      return res.status(201).json(caseStudy);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { institutionId, studentId } = req.params;

      const caseStudy = await this.caseStudyService.getCaseStudy(
        req.userId!,
        institutionId as string,
        studentId as string,
      );

      return res.json(caseStudy);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { institutionId, studentId } = req.params;
      const data = req.body;

      const caseStudy = await this.caseStudyService.updateCaseStudy(
        req.userId!,
        institutionId as string,
        studentId as string,
        data,
      );

      return res.json(caseStudy);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
