import { Router } from "express";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { AiTesterController } from "./ai-tester.controller";

const aiTesterRoutes = Router();

const aiTesterController = new AiTesterController();

aiTesterRoutes.get("/teste", (req, res) => {
  return aiTesterController.teste(req, res);
});


export default aiTesterRoutes;