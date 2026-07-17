import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// drizzle-kit runs outside Next.js so it won't auto-load .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema:  "./db/schema.ts",
  out:     "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // better-auth owns the `user` table; don't let drizzle-kit touch it
  tablesFilter: ["user_stats", "practice_sessions", "user_achievements"],
  verbose: true,
  strict: true,
});
