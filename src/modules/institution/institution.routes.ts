import { Router } from "express";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { InstitutionController } from "./institution.controller";

const institutionsRoutes = Router();
const controller = new InstitutionController();

institutionsRoutes.use(ensureAuthenticated);

institutionsRoutes.post("/", (req, res) => controller.create(req, res));
institutionsRoutes.get("/", (req, res) => controller.listMine(req, res));
institutionsRoutes.post("/:institutionId/users", (req, res) =>
  controller.addUser(req, res),
);

export default institutionsRoutes;
