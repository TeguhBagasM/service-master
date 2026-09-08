import { z } from "zod";

export const createPersyaratanSchema = z.object({
  beasiswaId: z.number().int().positive("ID beasiswa harus angka positif"),
  nama: z.string().min(1, "Nama persyaratan wajib diisi").max(255),
  deskripsi: z.string().max(65535).optional(),
  urutan: z.number().int().min(0).default(0),
});

export const updatePersyaratanSchema = z.object({
  nama: z.string().min(1, "Nama persyaratan wajib diisi").max(255).optional(),
  deskripsi: z.string().max(65535).optional(),
  urutan: z.number().int().min(0).optional(),
});

export const persyaratanQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  beasiswaId: z.coerce.number().int().positive().optional(),
});

export type CreatePersyaratanInput = z.infer<typeof createPersyaratanSchema>;
export type UpdatePersyaratanInput = z.infer<typeof updatePersyaratanSchema>;
export type PersyaratanQueryInput = z.infer<typeof persyaratanQuerySchema>;
