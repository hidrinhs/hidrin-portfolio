import { env } from "cloudflare:workers";

type PortfolioEnv = { DB: D1Database; BUCKET: R2Bucket; ADMIN_EMAIL?: string };
export function bindings() { return env as unknown as PortfolioEnv; }
export function database() {
  const db = bindings().DB;
  if (!db) throw new Error("Portfolio database is unavailable");
  return db;
}
