import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

async function main() {
  const beasiswas = [
    {
      nama: "Beasiswa Prestasi Akademik",
      deskripsi: "Beasiswa untuk mahasiswa berprestasi dengan IPK minimal 3.5",
      status: "AKTIF" as const,
    },
    {
      nama: "Beasiswa Kipper Kuliah",
      deskripsi: "Beasiswa untuk mahasiswa kurang mampu (KIP Kuliah)",
      status: "AKTIF" as const,
    },
    {
      nama: "Beasiswa Difabel",
      deskripsi: "Beasiswa khusus mahasiswa penyandang disabilitas",
      status: "NONAKTIF" as const,
    },
  ];

  for (const b of beasiswas) {
    await prisma.beasiswa.upsert({
      where: { id: beasiswas.indexOf(b) + 1 },
      update: b,
      create: { id: beasiswas.indexOf(b) + 1, ...b },
    });
  }

  const persyaratanList = [
    { beasiswaId: 1, nama: "Transkrip Nilai", deskripsi: "Transkrip nilai terakhir, IPK >= 3.5", urutan: 1 },
    { beasiswaId: 1, nama: "Surat Rekomendasi", deskripsi: "Surat rekomendasi dari dosen pembimbing", urutan: 2 },
    { beasiswaId: 1, nama: "Essay", deskripsi: "Essay rencana studi maksimal 500 kata", urutan: 3 },
    { beasiswaId: 2, nama: "Kartu KIP Kuliah", deskripsi: "Fotokopi kartu KIP Kuliah yang masih berlaku", urutan: 1 },
    { beasiswaId: 2, nama: "Surat Keterangan Tidak Mampu", deskripsi: "Surat dari kelurahan/desa", urutan: 2 },
    { beasiswaId: 2, nama: "Transkrip Nilai", deskripsi: "Transkrip nilai terakhir", urutan: 3 },
    { beasiswaId: 3, nama: "Surat Keterangan Disabilitas", deskripsi: "Surat keterangan dari rumah sakit / puskesmas", urutan: 1 },
    { beasiswaId: 3, nama: "Transkrip Nilai", deskripsi: "Transkrip nilai terakhir", urutan: 2 },
  ];

  for (const p of persyaratanList) {
    const existing = await prisma.persyaratan.findFirst({
      where: { beasiswaId: p.beasiswaId, nama: p.nama, deletedAt: null },
    });
    if (!existing) {
      await prisma.persyaratan.create({ data: p });
    }
  }

  console.log("Seed selesai: beasiswa dan persyaratan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
