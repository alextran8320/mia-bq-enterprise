import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../lib/env.js";
import * as schema from "./schema.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Neon pooler uses TLS — pg honors sslmode=require in the URL when ssl=true.
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
});

export const db = drizzle(pool, { schema });

export { schema };
