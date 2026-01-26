import { Router } from "express";
import { UserController } from "./user.controller";

const userRoutes = Router();

const userController = new UserController();

userRoutes.get("/:userUuid", (req, res) => {
  return userController.get(req, res);
});

userRoutes.post("/", (req, res) => {
  return userController.create(req, res);
});

export default userRoutes;
