import { z } from "zod";

export const createPersyaratanSchema = z.object({
  beasiswaId: z.number().int().positive("ID beasiswa harus angka positif"),
  namaDokumen: z.string().min(1, "Nama dokumen wajib diisi").max(255),
  wajib: z.boolean().default(true),
});

export const updatePersyaratanSchema = z.object({
  namaDokumen: z.string().min(1, "Nama dokumen wajib diisi").max(255).optional(),
  wajib: z.boolean().optional(),
});

export type CreatePersyaratanInput = z.infer<typeof createPersyaratanSchema>;
export type UpdatePersyaratanInput = z.infer<typeof updatePersyaratanSchema>;
