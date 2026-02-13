import { prisma } from "@/lib/prisma";

/* =========================
   PAGE
========================= */

export default async function PengembalianPage() {
  // Hitung 14 hari ke belakang
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const data = await prisma.peminjaman.findMany({
    where: {
      status: "dikembalikan",
      tanggalDikembalikan: {
        gte: fourteenDaysAgo,
      },
    },
    orderBy: {
      tanggalDikembalikan: "desc",
    },
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Data Pengembalian
        </h1>

        <p className="text-sm text-gray-600">
          Buku yang telah dikembalikan (14 hari terakhir)
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

            {/* Status */}
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-200 text-emerald-800">
                Dikembalikan
              </span>
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
                  {/* Status */}
                  <Td>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-200 text-emerald-800">
                      Dikembalikan
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
   HELPER COMPONENT
========================= */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-left font-semibold ${className}`}
    >
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
    <td
      className={`px-4 py-3 ${className}`}
    >
      {children}
    </td>
  );
}


/* =========================
   FORMAT DATE
========================= */

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("id-ID");
}
