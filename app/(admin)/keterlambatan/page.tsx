// app/keterlambatan/page.tsx

import { prisma } from "@/lib/prisma";
import { AlertTriangle } from "lucide-react";

/* =========================
   PAGE
========================= */

export default async function KeterlambatanPage() {
  const today = new Date();

  const data = await prisma.peminjaman.findMany({
    where: {
      status: "dipinjam",
      tanggalKembali: { lt: today },
    },
    orderBy: {
      tanggalKembali: "asc",
    },
  });

  return (
    <div className="mt-16 md:mt-0 mb-10 space-y-8 px-4">

      {/* ================= HEADER ================= */}
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={24} />
          Data Keterlambatan
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          Daftar siswa yang terlambat mengembalikan buku
        </p>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">

        {data.length === 0 && (
          <div className="bg-gray-200 rounded-xl p-6 text-center text-gray-600 shadow">
            🎉 Tidak ada keterlambatan
          </div>
        )}

        {data.map((item) => (
          <div
            key={item.id}
            className="bg-gray-200 rounded-2xl p-4 shadow space-y-3"
          >
            <div className="font-semibold text-gray-800">
              {item.judulBuku}
            </div>

            <div className="text-sm text-gray-700">
              {item.namaSiswa} • {item.kelas}
            </div>

            <div className="text-sm font-semibold text-red-700">
              {new Date(item.tanggalKembali).toLocaleDateString("id-ID")}
            </div>

            <div className="pt-2">
              <span
                className="
                  inline-block
                  px-3 py-1
                  text-xs
                  font-semibold
                  rounded-full
                  bg-red-200
                  text-red-800
                "
              >
                Terlambat
              </span>
            </div>
          </div>
        ))}

      </div>

      {/* ================= DESKTOP TABLE VIEW ================= */}
      <div className="hidden md:block bg-gray-200 rounded-2xl shadow-md overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800">

            <thead className="bg-red-200 text-red-900">
              <tr>
                <Th>Judul Buku</Th>
                <Th>Nama Siswa</Th>
                <Th>Kelas</Th>
                <Th>Tanggal Kembali</Th>
                <Th>Status</Th>
              </tr>
            </thead>

            <tbody>

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-600"
                  >
                    🎉 Tidak ada keterlambatan
                  </td>
                </tr>
              )}

              {data.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-t border-gray-300
                    hover:bg-red-100/40
                    transition
                  "
                >
                  <Td>{item.judulBuku}</Td>
                  <Td>{item.namaSiswa}</Td>
                  <Td>{item.kelas}</Td>

                  <Td className="font-semibold text-red-700">
                    {new Date(item.tanggalKembali).toLocaleDateString("id-ID")}
                  </Td>

                  <Td>
                    <span
                      className="
                        inline-block
                        px-3 py-1
                        text-xs
                        font-semibold
                        rounded-full
                        bg-red-200
                        text-red-800
                      "
                    >
                      Terlambat
                    </span>
                  </Td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}

/* =========================
   HELPER
========================= */

function Th({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}