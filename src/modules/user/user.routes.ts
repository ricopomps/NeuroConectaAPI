import { Router } from "express";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { UserController } from "./user.controller";

const userRoutes = Router();

const userController = new UserController();

userRoutes.get("/me", ensureAuthenticated, (req, res) => {
  return userController.me(req, res);
});

userRoutes.get("/:userUuid", (req, res) => {
  return userController.get(req, res);
});

userRoutes.post("/", (req, res) => {
  return userController.create(req, res);
});

export default userRoutes;
