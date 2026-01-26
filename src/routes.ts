import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ status: "ok", service: "NeuroConecta" });
});

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);

export default routes;
