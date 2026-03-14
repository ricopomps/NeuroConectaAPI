import { Router } from "express";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { AuditLogController } from "./audit-report.controller";

const auditLogRoutes = Router();

const auditLogController = new AuditLogController();

auditLogRoutes.get("/", ensureAuthenticated, (req, res) => {
  return auditLogController.getAuditReport(req, res);
});

auditLogRoutes.get("/excel/:token/:reportName'", ensureAuthenticated, (req, res) => {
  return auditLogController.getAuditReportExcel(req, res);
});

export default auditLogRoutes;
