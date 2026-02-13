import {
  BookOpenCheck,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function DashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // DIPINJAM HARI INI
  const dipinjamHariIni = await prisma.peminjaman.count({
    where: {
      tanggalPinjam: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // DIKEMBALIKAN HARI INI
  const dikembalikanHariIni = await prisma.peminjaman.count({
    where: {
      status: "dikembalikan",
      tanggalDikembalikan: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // TERLAMBAT DIKEMBALIKAN
  const terlambat = await prisma.peminjaman.count({
    where: {
      status: "dipinjam",
      tanggalKembali: {
        lt: today,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-600 p-6">
      
      {/* ================= HEADER ================= */}
<div className="mt-16 md:mt-0 mb-8">
  <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
    Dashboard
  </h1>
  <p className="text-gray-300 mt-1 text-sm md:text-base">
    Ringkasan aktivitas perpustakaan hari ini
  </p>

  <div className="mt-4 h-px bg-gray-500/50 rounded-full"></div>
</div>

      {/* ================= CARD GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Dipinjam Hari Ini"
          value={dipinjamHariIni}
          bg="bg-blue-200 text-blue-900"
          icon={<BookOpenCheck size={36} />}
          href="/data-peminjaman"
        />

        <DashboardCard
          title="Dikembalikan Hari Ini"
          value={dikembalikanHariIni}
          bg="bg-emerald-200 text-emerald-900"
          icon={<RotateCcw size={36} />}
          href="/pengembalian"
        />

        <DashboardCard
          title="Terlambat Dikembalikan"
          value={terlambat}
          bg="bg-rose-200 text-rose-900"
          icon={<AlertTriangle size={36} />}
          badge
          href="/keterlambatan"
        />
      </div>
    </div>
  );
}

/* =========================
   COMPONENT CARD
========================= */

function DashboardCard({
  title,
  value,
  bg,
  icon,
  badge = false,
  href,
}: {
  title: string;
  value: number;
  bg: string;
  icon: React.ReactNode;
  badge?: boolean;
  href?: string;
}) {
  const Card = (
    <div
      className={`
        ${bg}
        relative
        rounded-2xl
        p-6
        shadow-lg
        hover:shadow-xl
        hover:scale-[1.02]
        transition-all
        duration-300
        cursor-pointer
      `}
    >
      {badge && value > 0 && (
        <span className="absolute top-3 right-3 bg-white/80 backdrop-blur text-rose-600 text-xs font-bold px-2 py-1 rounded-full">
          {value}
        </span>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 tracking-wide">
            {title}
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>
        </div>
        <div className="opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{Card}</Link> : Card;
}