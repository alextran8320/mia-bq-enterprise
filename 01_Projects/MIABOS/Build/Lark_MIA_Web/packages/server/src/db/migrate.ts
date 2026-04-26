import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./client.js";
import { logger } from "../lib/logger.js";

async function main() {
  logger.info("[migrate] running pending migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  logger.info("[migrate] done");
  await pool.end();
}

main().catch((err) => {
  logger.error({ err }, "[migrate] failed");
  process.exit(1);
});
