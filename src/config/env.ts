import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5002),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET wajib diisi (min 32 karakter)"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN wajib diisi"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("==========================================");
  console.error("FAILED TO START: validasi environment variable gagal.");
  console.error("Cek file .env kamu — wajib ada: DATABASE_URL, JWT_SECRET, CORS_ORIGIN.");
  for (const issue of parsed.error.issues) {
    const path = issue.path.join(".");
    console.error(`  - [${path}] ${issue.message}`);
  }
  console.error("==========================================");
  throw new Error("Invalid environment variables — service tidak bisa start");
}

export const env = parsed.data;
