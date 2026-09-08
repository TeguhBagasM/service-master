import { z } from "zod";

export const beasiswaQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
});

export const createBeasiswaSchema = z
  .object({
    nama: z.string().min(1, "Nama beasiswa wajib diisi").max(255),
    deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
    kuota: z.number().int().positive("Kuota harus lebih dari 0"),
    tanggalBuka: z.coerce.date({ message: "tanggalBuka harus tanggal valid" }),
    tanggalTutup: z.coerce.date({ message: "tanggalTutup harus tanggal valid" }),
  })
  .refine((data) => data.tanggalTutup > data.tanggalBuka, {
    message: "Tanggal tutup harus setelah tanggal buka",
    path: ["tanggalTutup"],
  });

export const updateBeasiswaSchema = z
  .object({
    nama: z.string().min(1, "Nama beasiswa wajib diisi").max(255).optional(),
    deskripsi: z.string().min(1, "Deskripsi wajib diisi").optional(),
    kuota: z.number().int().positive("Kuota harus lebih dari 0").optional(),
    tanggalBuka: z.coerce.date({ message: "tanggalBuka harus tanggal valid" }).optional(),
    tanggalTutup: z.coerce.date({ message: "tanggalTutup harus tanggal valid" }).optional(),
  })
  .refine(
    (data) => {
      if (data.tanggalBuka !== undefined && data.tanggalTutup !== undefined) {
        return data.tanggalTutup > data.tanggalBuka;
      }
      return true;
    },
    {
      message: "Tanggal tutup harus setelah tanggal buka",
      path: ["tanggalTutup"],
    },
  )
  .refine(
    (data) => {
      const hasAny = data.tanggalBuka !== undefined || data.tanggalTutup !== undefined;
      const hasBoth = data.tanggalBuka !== undefined && data.tanggalTutup !== undefined;
      return !hasAny || hasBoth;
    },
    {
      message: "tanggalBuka dan tanggalTutup harus diisi bersamaan",
      path: ["tanggalTutup"],
    },
  );

export type BeasiswaQueryInput = z.infer<typeof beasiswaQuerySchema>;
export type CreateBeasiswaInput = z.infer<typeof createBeasiswaSchema>;
export type UpdateBeasiswaInput = z.infer<typeof updateBeasiswaSchema>;
