"use server";

import { prisma } from "@/lib/prisma";

/* =========================
   TYPES
========================= */
export type GrafikItem = {
  key: string;
  total: number;
};

/* =========================
   HELPER TAHUN AJARAN
========================= */

// Menentukan tahun awal TA aktif (Juli–Juni)
function getCurrentAcademicStartYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = Januari

  // Jika bulan >= Juli (6), berarti sudah masuk TA baru
  return month >= 6 ? year : year - 1;
}

// Generate daftar TA otomatis (default 4 TA terakhir)
function generateDaftarTA(jumlah = 4): string[] {
  const startAcademicYear = getCurrentAcademicStartYear();

  return Array.from({ length: jumlah }, (_, i) => {
    const start = startAcademicYear - (jumlah - 1) + i;
    return `${start}/${start + 1}`;
  });
}

// Bulan dalam satu tahun ajaran (Juli–Juni)
function getSemesterMonths(tahunAjaran: string) {
  const [startYear, endYear] = tahunAjaran.split("/").map(Number);

  return [
    { month: 7, year: startYear },
    { month: 8, year: startYear },
    { month: 9, year: startYear },
    { month: 10, year: startYear },
    { month: 11, year: startYear },
    { month: 12, year: startYear },
    { month: 1, year: endYear },
    { month: 2, year: endYear },
    { month: 3, year: endYear },
    { month: 4, year: endYear },
    { month: 5, year: endYear },
    { month: 6, year: endYear },
  ];
}

/* =========================
   BASE DATA
========================= */

async function getAllPeminjaman() {
  return prisma.peminjaman.findMany({
    select: { tanggalPinjam: true },
  });
}

async function getAllKunjungan() {
  return prisma.kunjungan.findMany({
    select: { tanggal: true },
  });
}

/* =========================
   PEMINJAMAN SEMESTER (TA)
========================= */

export async function getGrafikSemester() {
  const daftarTA = generateDaftarTA();
  const allData = await getAllPeminjaman();

  const result: Record<string, GrafikItem[]> = {};

  for (const ta of daftarTA) {
    const months = getSemesterMonths(ta);

    result[ta] = months.map(({ month, year }) => {
      const total = allData.filter((item) => {
        const t = new Date(item.tanggalPinjam);
        return (
          t.getMonth() + 1 === month &&
          t.getFullYear() === year
        );
      }).length;

      return {
        key: `${month}/${year}`,
        total,
      };
    });
  }

  return result;
}

/* =========================
   PEMINJAMAN TAHUNAN (5 Tahun Terakhir)
========================= */

export async function getGrafikTahunan() {
  const allData = await getAllPeminjaman();
  const currentYear = new Date().getFullYear();

  const yearsToShow = 5;
  const result: GrafikItem[] = [];

  for (let i = yearsToShow - 1; i >= 0; i--) {
    const year = currentYear - i;

    const total = allData.filter(
      (item) =>
        new Date(item.tanggalPinjam).getFullYear() === year
    ).length;

    result.push({
      key: year.toString(),
      total,
    });
  }

  return result;
}

/* =========================
   KUNJUNGAN SEMESTER (TA)
========================= */

export async function getKunjunganSemester() {
  const daftarTA = generateDaftarTA();
  const allData = await getAllKunjungan();

  const result: Record<string, GrafikItem[]> = {};

  for (const ta of daftarTA) {
    const months = getSemesterMonths(ta);

    result[ta] = months.map(({ month, year }) => {
      const total = allData.filter((item) => {
        const t = new Date(item.tanggal);
        return (
          t.getMonth() + 1 === month &&
          t.getFullYear() === year
        );
      }).length;

      return {
        key: `${month}/${year}`,
        total,
      };
    });
  }

  return result;
}

/* =========================
   KUNJUNGAN TAHUNAN (5 Tahun Terakhir)
========================= */

export async function getKunjunganTahunan() {
  const allData = await getAllKunjungan();
  const currentYear = new Date().getFullYear();

  const yearsToShow = 5;
  const result: GrafikItem[] = [];

  for (let i = yearsToShow - 1; i >= 0; i--) {
    const year = currentYear - i;

    const total = allData.filter(
      (item) =>
        new Date(item.tanggal).getFullYear() === year
    ).length;

    result.push({
      key: year.toString(),
      total,
    });
  }

  return result;
}