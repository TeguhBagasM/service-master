import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { CreatePersyaratanInput, UpdatePersyaratanInput } from "./schema.js";

const persyaratanSelect = {
  id: true,
  beasiswaId: true,
  namaDokumen: true,
  wajib: true,
  createdAt: true,
} as const;

export async function listPersyaratanByBeasiswa(beasiswaId: number) {
  const beasiswa = await prisma.beasiswa.findUnique({
    where: { id: beasiswaId },
    select: { id: true },
  });

  if (!beasiswa) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  const persyaratan = await prisma.persyaratan.findMany({
    where: { beasiswaId },
    select: persyaratanSelect,
    orderBy: { id: "asc" },
  });

  return persyaratan;
}

export async function getPersyaratanById(id: number) {
  const persyaratan = await prisma.persyaratan.findUnique({
    where: { id },
    select: persyaratanSelect,
  });

  if (!persyaratan) {
    throw new AppError(404, "Persyaratan tidak ditemukan");
  }

  return persyaratan;
}

export async function createPersyaratan(data: CreatePersyaratanInput) {
  // Validasi manual beasiswaId sebelum insert supaya tidak memunculkan
  // foreign key error mentah (kode P2003) dari Prisma ke client.
  const beasiswa = await prisma.beasiswa.findUnique({
    where: { id: data.beasiswaId },
    select: { id: true },
  });

  if (!beasiswa) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  const persyaratan = await prisma.persyaratan.create({
    data: {
      beasiswaId: data.beasiswaId,
      namaDokumen: data.namaDokumen,
      wajib: data.wajib,
    },
    select: persyaratanSelect,
  });

  return persyaratan;
}

export async function updatePersyaratan(id: number, data: UpdatePersyaratanInput) {
  const existing = await prisma.persyaratan.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, "Persyaratan tidak ditemukan");
  }

  const updateData: {
    namaDokumen?: string;
    wajib?: boolean;
  } = {};

  if (data.namaDokumen !== undefined) updateData.namaDokumen = data.namaDokumen;
  if (data.wajib !== undefined) updateData.wajib = data.wajib;

  const persyaratan = await prisma.persyaratan.update({
    where: { id },
    data: updateData,
    select: persyaratanSelect,
  });

  return persyaratan;
}

// HARD DELETE sengaja dipakai untuk Persyaratan (berbeda dari Beasiswa yang
// memakai soft delete = statusAktif false). Alasannya: id persyaratan TIDAK
// direferensikan langsung oleh service lain (mis. service-transaksi), sehingga
// menghapus baris persyaratan tidak akan memutus data rujukan lintas service.
// Sebaliknya, beasiswaId direferensikan oleh pendaftaran aktif di service lain,
// maka Beasiswa wajib memakai soft delete agar referensi itu tidak hilang.
export async function deletePersyaratan(id: number) {
  const existing = await prisma.persyaratan.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, "Persyaratan tidak ditemukan");
  }

  await prisma.persyaratan.delete({ where: { id } });

  return { message: "Persyaratan berhasil dihapus permanen" };
}
