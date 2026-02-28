import { Router } from "express";
import { AssessmentController } from "./assessment.controller";

const assesmentRoutes = Router();

const assessmentController = new AssessmentController();

assesmentRoutes.post("/generate", (req, res) => {
  return assessmentController.generateDoc(req, res);
});

assesmentRoutes.post("/save", (req, res) => {
  return assessmentController.create(req, res);
});

assesmentRoutes.patch("/:assessmentId", (req, res) => {
  return assessmentController.update(req, res);
});

assesmentRoutes.get("/student/:studentId", (req, res) =>
  assessmentController.list(req, res),
);

assesmentRoutes.get("/download/:token/:assessmentDocName", (req, res) =>
  assessmentController.download(req, res),
);


export default assesmentRoutes;