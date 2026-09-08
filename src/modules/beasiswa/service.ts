import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateBeasiswaInput, BeasiswaQueryInput, UpdateBeasiswaInput } from "./schema.js";

const beasiswaSelect = {
  id: true,
  nama: true,
  deskripsi: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

const persyaratanSelect = {
  id: true,
  nama: true,
  deskripsi: true,
  urutan: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function listBeasiswa(query: BeasiswaQueryInput) {
  const { page, limit, search, status } = query;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { nama: { contains: search } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.beasiswa.findMany({
      where,
      select: beasiswaSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.beasiswa.count({ where }),
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

export async function listBeasiswaAktif(query: BeasiswaQueryInput) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    status: "AKTIF" as const,
    ...(search ? { nama: { contains: search } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.beasiswa.findMany({
      where,
      select: beasiswaSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.beasiswa.count({ where }),
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

export async function getBeasiswaById(id: number) {
  const beasiswa = await prisma.beasiswa.findFirst({
    where: { id, deletedAt: null },
    select: {
      ...beasiswaSelect,
      persyaratan: {
        where: { deletedAt: null },
        select: persyaratanSelect,
        orderBy: { urutan: "asc" },
      },
    },
  });

  if (!beasiswa) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  return beasiswa;
}

export async function getBeasiswaDetail(id: number) {
  const beasiswa = await prisma.beasiswa.findFirst({
    where: { id, deletedAt: null, status: "AKTIF" },
    select: {
      ...beasiswaSelect,
      persyaratan: {
        where: { deletedAt: null },
        select: persyaratanSelect,
        orderBy: { urutan: "asc" },
      },
    },
  });

  if (!beasiswa) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  return beasiswa;
}

export async function createBeasiswa(data: CreateBeasiswaInput) {
  const beasiswa = await prisma.beasiswa.create({
    data: {
      nama: data.nama,
      deskripsi: data.deskripsi ?? null,
      status: data.status,
    },
    select: beasiswaSelect,
  });

  return beasiswa;
}

export async function updateBeasiswa(id: number, data: UpdateBeasiswaInput) {
  const existing = await prisma.beasiswa.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  const updateData: {
    nama?: string;
    deskripsi?: string | null;
    status?: "AKTIF" | "NONAKTIF";
  } = {};

  if (data.nama !== undefined) updateData.nama = data.nama;
  if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi ?? null;
  if (data.status !== undefined) updateData.status = data.status;

  const beasiswa = await prisma.beasiswa.update({
    where: { id },
    data: updateData,
    select: beasiswaSelect,
  });

  return beasiswa;
}

export async function softDeleteBeasiswa(id: number) {
  const existing = await prisma.beasiswa.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  await prisma.$transaction([
    prisma.beasiswa.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),
    prisma.persyaratan.updateMany({
      where: { beasiswaId: id, deletedAt: null },
      data: { deletedAt: new Date() },
    }),
  ]);

  return { message: "Beasiswa dan persyaratan terkait berhasil dihapus" };
}

export async function deactivateBeasiswa(id: number) {
  const existing = await prisma.beasiswa.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  if (existing.status === "NONAKTIF") {
    throw new AppError(400, "Beasiswa sudah nonaktif");
  }

  const beasiswa = await prisma.beasiswa.update({
    where: { id },
    data: { status: "NONAKTIF" },
    select: beasiswaSelect,
  });

  return beasiswa;
}
