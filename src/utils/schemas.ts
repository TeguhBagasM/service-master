import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("ID harus angka positif"),
});

export const beasiswaIdParamSchema = z.object({
  beasiswaId: z.coerce.number().int().positive("ID beasiswa harus angka positif"),
});
