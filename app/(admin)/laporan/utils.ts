/* =========================
   HELPER UTIL
========================= */

export function getNamaBulan(bulan: number) {
  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return namaBulan[bulan - 1];
}

export function getTahunAjaran(bulan: number, tahun: number) {
  // Juli–Desember
  if (bulan >= 7) {
    return `${tahun} / ${tahun + 1}`;
  }

  // Januari–Juni
  return `${tahun - 1} / ${tahun}`;
}