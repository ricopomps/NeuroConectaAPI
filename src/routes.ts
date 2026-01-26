import { Router } from "express";
import { UserController } from "./modules/user/user.controller";

const routes = Router();

const userController = new UserController();

routes.get("/health", (req, res) => {
  return res.json({ status: "ok", service: "NeuroConecta" });
});

routes.post("/users", (req, res) => {
  return userController.create(req, res);
});

export default routes;
