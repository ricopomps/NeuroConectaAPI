import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", (req, res) => {
  return authController.login(req, res);
});

authRoutes.post("/forgot-password", (req, res) => {
  return authController.requestPasswordReset(req, res);
});

authRoutes.post("/reset-password", (req, res) => {
  return authController.resetPassword(req, res);
});

export default authRoutes;
