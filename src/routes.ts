import { Router } from "express";
import userRoutes from "./modules/user/user.routes";
const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ status: "ok", service: "NeuroConecta" });
});

routes.use("/users", userRoutes);

export default routes;
