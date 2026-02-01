import cors from "cors";
import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONT_URL || "", process.env.FRONT_LOCAL_URL || ""],
    credentials: true,
  }),
);

app.use(routes);

export default app;
