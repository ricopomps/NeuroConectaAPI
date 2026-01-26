import { Router } from "express";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { InstitutionController } from "./institution.controller";

const routes = Router();
const controller = new InstitutionController();

routes.use(ensureAuthenticated);

routes.post("/", (req, res) => controller.create(req, res));
routes.get("/", (req, res) => controller.listMine(req, res));
routes.post("/:institutionId/users", (req, res) =>
  controller.addUser(req, res),
);

export default routes;
