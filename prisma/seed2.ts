import { StatusPeminjaman, Prisma } from "@/generated/prisma/browser";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// ambil jumlah dari CLI
const [
  ,
  ,
  userCountArg,
  kunjunganCountArg,
  peminjamanCountArg,
] = process.argv;

const USER_COUNT = Number(userCountArg) || 5;
const KUNJUNGAN_COUNT = Number(kunjunganCountArg) || 50;
const PEMINJAMAN_COUNT = Number(peminjamanCountArg) || 100;

async function main() {
  console.log("🌱 Seeding database...");
  console.log({
    USER_COUNT,
    KUNJUNGAN_COUNT,
    PEMINJAMAN_COUNT,
  });

  /* ======================
     USER
  ====================== */

  const users: Prisma.UserCreateManyInput[] = [];

  // password default semua user
  const defaultPassword = await bcrypt.hash("admin123", 10);

  // Admin utama (buat login)
  users.push({
    nama: "Admin Perpustakaan",
    email: "admin@perpus.com",
    password: defaultPassword,
    role: "admin",
  });

  // User dummy
  for (let i = 0; i < USER_COUNT; i++) {
    users.push({
      nama: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: defaultPassword,
      role: faker.helpers.arrayElement(["admin", "petugas"]),
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("✅ User seeded");

  /* ======================
     KUNJUNGAN
  ====================== */

  const kunjunganData: Prisma.KunjunganCreateManyInput[] = [];

  for (let i = 0; i < KUNJUNGAN_COUNT; i++) {
    kunjunganData.push({
      kelas: faker.helpers.arrayElement([
        "X IPA 1",
        "X IPA 2",
        "XI IPS 1",
        "XI IPS 2",
        "XII IPA 1",
      ]),
      jam: faker.helpers.arrayElement([
        "07:00 - 08:00",
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
      ]),
      guru: faker.person.fullName(),
      tanggal: faker.date.between({
        from: "2024-01-01",
        to: "2026-12-20",
      }),
    });
  }

  await prisma.kunjungan.createMany({
    data: kunjunganData,
  });

  console.log("✅ Kunjungan seeded");

  /* ======================
     PEMINJAMAN
  ====================== */

  const peminjamanData: Prisma.PeminjamanCreateManyInput[] = [];

  for (let i = 0; i < PEMINJAMAN_COUNT; i++) {
    const tanggalPinjam = faker.date.recent({ days: 60 });
    const tanggalKembali = faker.date.soon({
      days: 7,
      refDate: tanggalPinjam,
    });

    const dikembalikan = faker.datatype.boolean();

    peminjamanData.push({
      judulBuku: faker.lorem.words({ min: 1, max: 4 }),
      pengarang: faker.person.fullName(),
      penerbit: faker.company.name(),
      [Prisma.PeminjamanScalarFieldEnum.namaSiswa]:
        faker.person.fullName(),
      kelas: faker.helpers.arrayElement([
        "X IPA 1",
        "XI IPA 2",
        "XI IPS 1",
        "XII IPA 3",
      ]),
      tanggalPinjam,
      tanggalKembali,
      tanggalDikembalikan: dikembalikan
        ? faker.date.between({
            from: tanggalPinjam,
            to: tanggalKembali,
          })
        : null,
      status: dikembalikan
        ? StatusPeminjaman.dikembalikan
        : StatusPeminjaman.dipinjam,
    });
  }

  await prisma.peminjaman.createMany({
    data: peminjamanData,
  });

  console.log("✅ Peminjaman seeded");

  console.log("🎉 Seeding selesai semua");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });