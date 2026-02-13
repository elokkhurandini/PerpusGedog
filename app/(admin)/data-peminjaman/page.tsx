// app/datapeminjaman/page.tsx

import { prisma } from "@/lib/prisma";
import TombolKembalikan from "@/components/TombolKembalikan";

/* =========================
   PAGE
========================= */

export default async function DataPeminjamanPage() {

  const data = await prisma.peminjaman.findMany({
    where: {
      status: "dipinjam",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mt-16 md:mt-0 mb-10 space-y-8 px-4">

      {/* ================= HEADER ================= */}
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Data Peminjaman
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Daftar seluruh peminjaman buku
        </p>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {data?.length === 0 && (
          <div className="bg-gray-200 rounded-xl p-6 text-center text-gray-600 shadow">
            🎉 Semua buku sudah dikembalikan
          </div>
        )}

        {data?.map((item) => (
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

            <div className="text-sm text-gray-600">
              {formatDate(item.tanggalPinjam)} -{" "}
              {formatDate(item.tanggalKembali)}
            </div>

            <div className="flex justify-between items-center pt-2">
              <StatusBadge status={item.status} />
              <TombolKembalikan id={item.id} />
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE VIEW ================= */}
      <div className="hidden md:block bg-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800">

            <thead className="bg-gray-300 text-gray-800">
              <tr>
                <Th>No</Th>
                <Th>Judul Buku</Th>
                <Th>Nama Siswa</Th>
                <Th>Kelas</Th>
                <Th>Tgl Pinjam</Th>
                <Th>Tgl Kembali</Th>
                <Th>Status</Th>
                <Th>Aksi</Th>
              </tr>
            </thead>

            <tbody>
              {data?.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-gray-600"
                  >
                    🎉 Semua buku sudah dikembalikan
                  </td>
                </tr>
              )}

              {data?.map((item, index) => (
                <tr
                  key={item.id}
                  className="
                    border-t border-gray-300
                    hover:bg-gray-300/50
                    transition
                  "
                >
                  <Td>{index + 1}</Td>
                  <Td className="font-medium">
                    {item.judulBuku}
                  </Td>
                  <Td>{item.namaSiswa}</Td>
                  <Td>{item.kelas}</Td>
                  <Td>{formatDate(item.tanggalPinjam)}</Td>
                  <Td>{formatDate(item.tanggalKembali)}</Td>
                  <Td>
                    <StatusBadge status={item.status} />
                  </Td>
                  <Td>
                    <TombolKembalikan id={item.id} />
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
   KOMPONEN BANTUAN
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

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const isDipinjam = status === "dipinjam";

  return (
    <span
      className={`
        inline-block
        px-3 py-1
        rounded-full
        text-xs
        font-semibold
        ${
          isDipinjam
            ? "bg-blue-200 text-blue-800"
            : "bg-emerald-200 text-emerald-800"
        }
      `}
    >
      {isDipinjam ? "Dipinjam" : "Dikembalikan"}
    </span>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("id-ID");
}