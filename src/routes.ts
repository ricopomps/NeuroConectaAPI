import { Router } from "express";
import assessmentRoutes from "./modules/assessment/assessment.routes";
import auditLogRoutes from "./modules/audit-report/audit-report.routes";
import authRoutes from "./modules/auth/auth.routes";
import caseStudyRoutes from "./modules/case-study/case-study.routes";
import institutionRoutes from "./modules/institution/institution.routes";
import studentsRoutes from "./modules/student/student.routes";
import userRoutes from "./modules/user/user.routes";
const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ status: "ok", service: "NeuroConecta" });
});

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/institutions", institutionRoutes);
routes.use("/students", studentsRoutes);
routes.use("/assessment", assessmentRoutes);
routes.use("/audit-report", auditLogRoutes);
routes.use("/case-study", caseStudyRoutes);

export default routes;
