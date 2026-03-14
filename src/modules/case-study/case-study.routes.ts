import { Router } from "express";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { CaseStudyController } from "./case-study.controller";

const caseStudyRoutes = Router();
const controller = new CaseStudyController();

caseStudyRoutes.use(ensureAuthenticated);

caseStudyRoutes.post("/:institutionId/students/:studentId", (req, res) =>
  controller.create(req, res),
);

caseStudyRoutes.get("/:institutionId/students/:studentId", (req, res) =>
  controller.get(req, res),
);

caseStudyRoutes.put("/:institutionId/students/:studentId", (req, res) =>
  controller.update(req, res),
);

export default caseStudyRoutes;
