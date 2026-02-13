"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  RefreshCcw,
  Undo2,
  AlertTriangle,
  BarChart3,
  LogOut,
  Users,
  School,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-800 flex items-center px-4 z-40">
        <button onClick={() => setIsOpen(true)} className="text-white">
          <Menu size={26} />
        </button>
        <span className="ml-4 text-white font-semibold text-sm">
          Perpustakaan SDN 2 Gedog
        </span>
      </div>

      {/* ================= OVERLAY ================= */}
      {isOpen && !isLoggingOut && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          shrink-0
          fixed md:sticky
          top-0 left-0
          h-screen min-h-full w-64
          bg-slate-800 text-white
          flex flex-col
          transform transition-all duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isLoggingOut ? "opacity-70 scale-95" : ""}
          md:translate-x-0
        `}
      >
       {/* HEADER */}
<div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-slate-700">
  <div className="flex items-center gap-3">
    {isError ? (
      <School size={48} />
    ) : (
      <img
        src="/logo-sd2-gedog.png"
        alt="Logo SDN 2 Gedog"
        className="h-12 w-12 object-contain rounded-md bg-white p-1"
        onError={() => setIsError(true)}
      />
    )}

    <div className="leading-tight">
      <div className="text-base font-semibold">
        Perpustakaan
      </div>
      <div className="text-slate-300 text-xs">
        SDN 2 Gedog Kota Blitar
      </div>
    </div>
  </div>

  <button
    onClick={() => setIsOpen(false)}
    className="md:hidden"
  >
    <X size={22} />
  </button>
</div>

        {/* MENU */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <MenuItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={pathname === "/dashboard"}
            closeSidebar={() => setIsOpen(false)}
          />
          <MenuItem
            href="/peminjaman"
            icon={<BookOpen size={20} />}
            label="Input Peminjaman"
            active={pathname === "/peminjaman"}
            closeSidebar={() => setIsOpen(false)}
          />
          <MenuItem
            href="/data-peminjaman"
            icon={<RefreshCcw size={20} />}
            label="Data Peminjaman"
            active={pathname === "/data-peminjaman"}
            closeSidebar={() => setIsOpen(false)}
          />
          <MenuItem
            href="/pengembalian"
            icon={<Undo2 size={20} />}
            label="Pengembalian"
            active={pathname === "/pengembalian"}
            closeSidebar={() => setIsOpen(false)}
          />
          <MenuItem
            href="/keterlambatan"
            icon={<AlertTriangle size={20} />}
            label="Keterlambatan"
            active={pathname === "/keterlambatan"}
            closeSidebar={() => setIsOpen(false)}
          />
          <MenuItem
            href="/kunjungan"
            icon={<Users size={20} />}
            label="Kunjungan"
            active={pathname === "/kunjungan"}
            closeSidebar={() => setIsOpen(false)}
          />
          <MenuItem
            href="/laporan"
            icon={<BarChart3 size={20} />}
            label="Laporan"
            active={pathname === "/laporan"}
            closeSidebar={() => setIsOpen(false)}
          />
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-slate-700 p-4">
          <button
            onClick={async () => {
              if (isLoggingOut) return;

              setIsLoggingOut(true);

              await fetch("/api/logout", { method: "GET" });

              setTimeout(() => {
                window.location.href = "/login";
              }, 800);
            }}
            disabled={isLoggingOut}
            className={`
              w-full flex items-center justify-center gap-3
              px-4 py-3 rounded-lg
              font-semibold
              transition-all duration-300
              ${
                isLoggingOut
                  ? "bg-red-800 scale-95 opacity-80 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {isLoggingOut ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={20} />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ================= MENU ITEM ================= */
function MenuItem({
  href,
  icon,
  label,
  active,
  closeSidebar,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  closeSidebar: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={closeSidebar}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition
        ${
          active
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:bg-slate-700 hover:text-white"
        }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}