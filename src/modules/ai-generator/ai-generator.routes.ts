import { Router } from "express";
import { AiGeneratorController } from "./ai-generator.controller";

const aiGeneratorRoutes = Router();

const aiGeneratorController = new AiGeneratorController();

aiGeneratorRoutes.post("/assessment", (req, res) => {
  return aiGeneratorController.generateDoc(req, res);
});


export default aiGeneratorRoutes;