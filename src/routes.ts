import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import institutionRoutes from "./modules/institution/institution.routes";
import userRoutes from "./modules/user/user.routes";
import { ensureAuthenticated } from "./shared/middlewares/ensureAuthenticated";
const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ status: "ok", service: "NeuroConecta" });
});

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/institutions", ensureAuthenticated, institutionRoutes);

export default routes;
