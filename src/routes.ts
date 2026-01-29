import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import institutionRoutes from "./modules/institution/institution.routes";
import studentsRoutes from "./modules/student/student.routes";
import userRoutes from "./modules/user/user.routes";
import aiTesterRoutes from "./modules/ai-tester/ai-tester.routes";
const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ status: "ok", service: "NeuroConecta" });
});

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/institutions", institutionRoutes);
routes.use("/students", studentsRoutes);
routes.use("/ai-tester", aiTesterRoutes);

export default routes;
