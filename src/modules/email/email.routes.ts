import { Router } from "express";
import { EmailController } from "./email.controller";

const emailRoutes = Router();
const controller = new EmailController();

emailRoutes.post("/test", (req, res) => controller.sendTest(req, res));

export default emailRoutes;
