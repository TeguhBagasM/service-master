import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRateLimiter } from "./middlewares/rate-limit.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { beasiswaRouter } from "./modules/beasiswa/routes.js";
import { persyaratanRouter } from "./modules/persyaratan/routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(",") }));
  app.use(express.json());
  app.use(apiRateLimiter);

  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "master" });
  });

  app.use("/master/beasiswa", beasiswaRouter);
  app.use("/master/persyaratan", persyaratanRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
