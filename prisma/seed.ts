import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Beasiswa 1: Masih aktif, belum tutup ──
  const b1 = await prisma.beasiswa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nama: "Beasiswa Prestasi Akademik 2026",
      deskripsi:
        "Beasiswa untuk mahasiswa berprestasi dengan IPK minimal 3.5. " +
        "Tersedia 50 kuota untuk semester ganjil 2026/2027.",
      kuota: 50,
      tanggalBuka: new Date("2026-07-01T00:00:00Z"),
      tanggalTutup: new Date("2026-10-31T23:59:59Z"),
      statusAktif: true,
    },
  });

  // ── Beasiswa 2: Masih aktif, kuota lebih kecil ──
  const b2 = await prisma.beasiswa.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nama: "Beasiswa Kipper Kuliah",
      deskripsi:
        "Beasiswa penuh untuk mahasiswa kurang mampu (penerima KIP Kuliah). " +
        "Cakupan SPP, uang pangkal, dan biaya hidup bulanan.",
      kuota: 25,
      tanggalBuka: new Date("2026-08-15T00:00:00Z"),
      tanggalTutup: new Date("2026-11-15T23:59:59Z"),
      statusAktif: true,
    },
  });

  // ── Beasiswa 3: Sudah lewat tanggalTutup — untuk testing filter ──
  const b3 = await prisma.beasiswa.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nama: "Beasiswa Diferensiasi 2025",
      deskripsi:
        "Beasiswa tahun lalu untuk mahasiswa penyandang disabilitas. " +
        "Sudah ditutup, hanya untuk testing filter data aktif vs nonaktif.",
      kuota: 20,
      tanggalBuka: new Date("2025-01-01T00:00:00Z"),
      tanggalTutup: new Date("2025-06-30T23:59:59Z"),
      statusAktif: false,
    },
  });

  // ── Persyaratan Beasiswa 1 ──
  const persyaratanB1 = [
    { beasiswaId: b1.id, namaDokumen: "Kartu Tanda Penduduk (KTP)", wajib: true },
    { beasiswaId: b1.id, namaDokumen: "Kartu Keluarga (KK)", wajib: true },
    { beasiswaId: b1.id, namaDokumen: "Transkrip Nilai Terakhir", wajib: true },
    { beasiswaId: b1.id, namaDokumen: "Surat Rekomendasi Dosen", wajib: false },
  ];

  for (const p of persyaratanB1) {
    const existing = await prisma.persyaratan.findFirst({
      where: { beasiswaId: p.beasiswaId, namaDokumen: p.namaDokumen },
    });
    if (!existing) await prisma.persyaratan.create({ data: p });
  }

  // ── Persyaratan Beasiswa 2 ──
  const persyaratanB2 = [
    { beasiswaId: b2.id, namaDokumen: "Kartu Tanda Penduduk (KTP)", wajib: true },
    { beasiswaId: b2.id, namaDokumen: "Kartu Keluarga (KK)", wajib: true },
    { beasiswaId: b2.id, namaDokumen: "Surat Keterangan Tidak Mampu", wajib: true },
    { beasiswaId: b2.id, namaDokumen: "Kartu KIP Kuliah", wajib: true },
  ];

  for (const p of persyaratanB2) {
    const existing = await prisma.persyaratan.findFirst({
      where: { beasiswaId: p.beasiswaId, namaDokumen: p.namaDokumen },
    });
    if (!existing) await prisma.persyaratan.create({ data: p });
  }

  // ── Persyaratan Beasiswa 3 (expired) ──
  const persyaratanB3 = [
    { beasiswaId: b3.id, namaDokumen: "Kartu Tanda Penduduk (KTP)", wajib: true },
    { beasiswaId: b3.id, namaDokumen: "Surat Keterangan Disabilitas", wajib: true },
    { beasiswaId: b3.id, namaDokumen: "Ijazah Terakhir", wajib: true },
  ];

  for (const p of persyaratanB3) {
    const existing = await prisma.persyaratan.findFirst({
      where: { beasiswaId: p.beasiswaId, namaDokumen: p.namaDokumen },
    });
    if (!existing) await prisma.persyaratan.create({ data: p });
  }

  console.log("Seed selesai:");
  console.log(`  - Beasiswa "${b1.nama}" (${b1.statusAktif ? "aktif" : "nonaktif"})`);
  console.log(`  - Beasiswa "${b2.nama}" (${b2.statusAktif ? "aktif" : "nonaktif"})`);
  console.log(`  - Beasiswa "${b3.nama}" (${b3.statusAktif ? "aktif" : "nonaktif"}, sudah lewat tutup)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
