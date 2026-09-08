import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { CreatePersyaratanInput, PersyaratanQueryInput, UpdatePersyaratanInput } from "./schema.js";

const persyaratanSelect = {
  id: true,
  beasiswaId: true,
  nama: true,
  deskripsi: true,
  urutan: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function listPersyaratan(query: PersyaratanQueryInput) {
  const { page, limit, search, beasiswaId } = query;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(beasiswaId ? { beasiswaId } : {}),
    ...(search ? { nama: { contains: search } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.persyaratan.findMany({
      where,
      select: persyaratanSelect,
      orderBy: { urutan: "asc" },
      skip,
      take: limit,
    }),
    prisma.persyaratan.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPersyaratanById(id: number) {
  const persyaratan = await prisma.persyaratan.findFirst({
    where: { id, deletedAt: null },
    select: persyaratanSelect,
  });

  if (!persyaratan) {
    throw new AppError(404, "Persyaratan tidak ditemukan");
  }

  return persyaratan;
}

export async function createPersyaratan(data: CreatePersyaratanInput) {
  const beasiswa = await prisma.beasiswa.findFirst({
    where: { id: data.beasiswaId, deletedAt: null },
  });

  if (!beasiswa) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  const persyaratan = await prisma.persyaratan.create({
    data: {
      beasiswaId: data.beasiswaId,
      nama: data.nama,
      deskripsi: data.deskripsi ?? null,
      urutan: data.urutan,
    },
    select: persyaratanSelect,
  });

  return persyaratan;
}

export async function updatePersyaratan(id: number, data: UpdatePersyaratanInput) {
  const existing = await prisma.persyaratan.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new AppError(404, "Persyaratan tidak ditemukan");
  }

  const updateData: {
    nama?: string;
    deskripsi?: string | null;
    urutan?: number;
  } = {};

  if (data.nama !== undefined) updateData.nama = data.nama;
  if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi ?? null;
  if (data.urutan !== undefined) updateData.urutan = data.urutan;

  const persyaratan = await prisma.persyaratan.update({
    where: { id },
    data: updateData,
    select: persyaratanSelect,
  });

  return persyaratan;
}

export async function softDeletePersyaratan(id: number) {
  const existing = await prisma.persyaratan.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new AppError(404, "Persyaratan tidak ditemukan");
  }

  await prisma.persyaratan.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { message: "Persyaratan berhasil dihapus" };
}
