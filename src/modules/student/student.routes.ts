import { Router } from "express";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { StudentController } from "./student.controller";

const studentsRoutes = Router();
const controller = new StudentController();

studentsRoutes.use(ensureAuthenticated);

studentsRoutes.post("/:institutionId/students", (req, res) =>
  controller.create(req, res),
);

studentsRoutes.get("/:institutionId/students", (req, res) =>
  controller.list(req, res),
);

export default studentsRoutes;
