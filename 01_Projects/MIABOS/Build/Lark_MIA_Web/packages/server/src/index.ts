import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { env } from "./lib/env.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/health.js";
import configRouter from "./routes/config.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import rolesRouter from "./routes/roles.js";
import customersRouter from "./routes/customers.js";
import leadsRouter from "./routes/leads.js";
import aiChatRouter from "./routes/aiChat.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === "/api/health",
    },
  }),
);

// Chrome DevTools auto-probes this path on every page load to discover
// workspace mappings. Returning 204 silences the 404 noise in the console.
app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
  res.status(204).end();
});

app.use("/api/health", healthRouter);
app.use("/api/config", configRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/customers", customersRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/ai-workspace", aiChatRouter);

app.use(errorHandler);

const port = env.PORT;
app.listen(port, () => {
  logger.info(`[server] listening on http://localhost:${port}`);
  logger.info(`[server] env: ${env.NODE_ENV}, CORS: ${env.CORS_ORIGINS.join(", ")}`);
});
