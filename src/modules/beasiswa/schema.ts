import { z } from "zod";

export const createBeasiswaSchema = z.object({
  nama: z.string().min(1, "Nama beasiswa wajib diisi").max(255),
  deskripsi: z.string().max(65535).optional(),
  status: z.enum(["AKTIF", "NONAKTIF"]).default("AKTIF"),
});

export const updateBeasiswaSchema = z.object({
  nama: z.string().min(1, "Nama beasiswa wajib diisi").max(255).optional(),
  deskripsi: z.string().max(65535).optional(),
  status: z.enum(["AKTIF", "NONAKTIF"]).optional(),
});

export const beasiswaQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["AKTIF", "NONAKTIF"]).optional(),
});

export type CreateBeasiswaInput = z.infer<typeof createBeasiswaSchema>;
export type UpdateBeasiswaInput = z.infer<typeof updateBeasiswaSchema>;
export type BeasiswaQueryInput = z.infer<typeof beasiswaQuerySchema>;
