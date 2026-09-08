import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { BeasiswaQueryInput, CreateBeasiswaInput, UpdateBeasiswaInput } from "./schema.js";

const beasiswaSelect = {
  id: true,
  nama: true,
  deskripsi: true,
  kuota: true,
  tanggalBuka: true,
  tanggalTutup: true,
  statusAktif: true,
  createdAt: true,
  updatedAt: true,
} as const;

const persyaratanSelect = {
  id: true,
  namaDokumen: true,
  wajib: true,
} as const;

export async function listBeasiswaAktif(query: BeasiswaQueryInput) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;
  const now = new Date();

  const where = {
    statusAktif: true,
    tanggalTutup: { gte: now },
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
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function listAllBeasiswa(query: BeasiswaQueryInput) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = {
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
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getBeasiswaById(id: number) {
  const now = new Date();

  const beasiswa = await prisma.beasiswa.findUnique({
    where: { id },
    select: {
      ...beasiswaSelect,
      persyaratan: { select: persyaratanSelect },
    },
  });

  if (!beasiswa || !beasiswa.statusAktif || beasiswa.tanggalTutup < now) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  return beasiswa;
}

export async function createBeasiswa(data: CreateBeasiswaInput) {
  const beasiswa = await prisma.beasiswa.create({
    data: {
      nama: data.nama,
      deskripsi: data.deskripsi,
      kuota: data.kuota,
      tanggalBuka: data.tanggalBuka,
      tanggalTutup: data.tanggalTutup,
    },
    select: beasiswaSelect,
  });

  return beasiswa;
}

export async function updateBeasiswa(id: number, data: UpdateBeasiswaInput) {
  const existing = await prisma.beasiswa.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  const updateData: {
    nama?: string;
    deskripsi?: string;
    kuota?: number;
    tanggalBuka?: Date;
    tanggalTutup?: Date;
  } = {};

  if (data.nama !== undefined) updateData.nama = data.nama;
  if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi;
  if (data.kuota !== undefined) updateData.kuota = data.kuota;
  if (data.tanggalBuka !== undefined) updateData.tanggalBuka = data.tanggalBuka;
  if (data.tanggalTutup !== undefined) updateData.tanggalTutup = data.tanggalTutup;

  const beasiswa = await prisma.beasiswa.update({
    where: { id },
    data: updateData,
    select: beasiswaSelect,
  });

  return beasiswa;
}

export async function softDeleteBeasiswa(id: number) {
  const existing = await prisma.beasiswa.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError(404, "Beasiswa tidak ditemukan");
  }

  if (!existing.statusAktif) {
    throw new AppError(400, "Beasiswa sudah tidak aktif");
  }

  const beasiswa = await prisma.beasiswa.update({
    where: { id },
    data: { statusAktif: false },
    select: beasiswaSelect,
  });

  return beasiswa;
}
