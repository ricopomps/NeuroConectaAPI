import { Request, Response } from "express";
import { AuditLogService } from "./audit-report.service";
import { AiAuditReportFiltersDto } from "./audit-report.repository";

export class AuditLogController {
  private readonly auditLogService = new AuditLogService();

  async getAuditReport(req: Request, res: Response) {
    try {
      const { page, size, filters } = req.query;

      const user = await this.auditLogService.getAuditReport(
        filters as AiAuditReportFiltersDto,
        Number(page),
        Number(size),
      );
      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getAuditReportExcel(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const excel = await this.auditLogService.downloadExcel(token as string);
      res.contentType("xlsx");
      res.send(excel);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
