"use client";

import { useEffect, useMemo, useState } from "react";
import Chart from "./Chart";
import DownloadPDFButton from "./DownloadPDFButton";
import {
  getGrafikSemester,
  getGrafikTahunan,
  getKunjunganSemester,
  getKunjunganTahunan,
} from "./actions";

type DataItem = {
  key: string;
  total: number;
};

/* ==============================
   HELPER TAHUN AJARAN (JULI–JUNI)
============================== */
function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = Januari

  return month >= 6
    ? `${year}/${year + 1}`
    : `${year - 1}/${year}`;
}

export default function LaporanPage() {
  const [semesterPeminjaman, setSemesterPeminjaman] =
    useState<{ [tahunAjaran: string]: DataItem[] }>({});

  const [yearlyPeminjaman, setYearlyPeminjaman] =
    useState<DataItem[]>([]);

  const [semesterKunjungan, setSemesterKunjungan] =
    useState<{ [tahunAjaran: string]: DataItem[] }>({});

  const [yearlyKunjungan, setYearlyKunjungan] =
    useState<DataItem[]>([]);

  const [activeChart, setActiveChart] =
    useState<"peminjaman" | "kunjungan">("peminjaman");

  const [mode, setMode] =
    useState<"semester" | "year">("semester");

  /* ==============================
     TAHUN AJARAN DINAMIS
  ============================== */

  const currentTA = useMemo(() => getCurrentAcademicYear(), []);

  const daftarTA = useMemo(() => {
    const startYear = parseInt(currentTA.split("/")[0]);

    return Array.from({ length: 4 }, (_, i) => {
      const year = startYear - (3 - i);
      return `${year}/${year + 1}`;
    });
  }, [currentTA]);

  const [selectedTA, setSelectedTA] =
    useState<string>(currentTA);

  /* ==============================
     FETCH DATA
  ============================== */
  useEffect(() => {
    (async () => {
      setSemesterPeminjaman(await getGrafikSemester());
      setYearlyPeminjaman(await getGrafikTahunan());

      setSemesterKunjungan(await getKunjunganSemester());
      setYearlyKunjungan(await getKunjunganTahunan());
    })();
  }, []);

  /* ==============================
     SAFETY CHECK (jika TA berubah)
  ============================== */
  useEffect(() => {
    if (!daftarTA.includes(selectedTA)) {
      setSelectedTA(currentTA);
    }
  }, [daftarTA, selectedTA, currentTA]);

  return (
    <div className="mt-16 mb-12 px-3 md:px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            Laporan Peminjaman & Kunjungan
          </h1>

          <DownloadPDFButton
            mode={mode}
            selectedTA={selectedTA}
          />
        </div>

        {/* =========================
            PEMINJAMAN
        ========================== */}
        <div
          onClick={() => setActiveChart("peminjaman")}
          className={`cursor-pointer ${
            activeChart === "peminjaman"
              ? "ring-2 ring-emerald-400 rounded-xl"
              : ""
          }`}
        >
          <Chart
            id="chart-peminjaman"
            title="Grafik Peminjaman Buku"
            color="#34d399"
            semesterData={semesterPeminjaman}
            yearlyData={yearlyPeminjaman}
            daftarTahunAjaran={daftarTA}
            mode={mode}
            setMode={setMode}
            selectedTA={selectedTA}
            setSelectedTA={setSelectedTA}
          />
        </div>

        {/* =========================
            KUNJUNGAN
        ========================== */}
        <div
          onClick={() => setActiveChart("kunjungan")}
          className={`cursor-pointer ${
            activeChart === "kunjungan"
              ? "ring-2 ring-blue-400 rounded-xl"
              : ""
          }`}
        >
          <Chart
            id="chart-kunjungan"
            title="Grafik Kunjungan Perpustakaan"
            color="#60a5fa"
            semesterData={semesterKunjungan}
            yearlyData={yearlyKunjungan}
            daftarTahunAjaran={daftarTA}
            mode={mode}
            setMode={setMode}
            selectedTA={selectedTA}
            setSelectedTA={setSelectedTA}
          />
        </div>

      </div>
    </div>
  );
}