import { prisma } from "@/lib/prisma";
import FormKunjungan from "./form";

export default async function KunjunganPage() {
  const data = await prisma.kunjungan.findMany({
    orderBy: { tanggal: "desc" },
  });

  return (
    <div className="mt-16 md:mt-0 mb-12 px-3 md:px-6">

      {/* WRAPPER BATASI LEBAR DI MOBILE */}
      <div className="max-w-xl mx-auto md:max-w-none space-y-8">

        {/* ================= HEADER ================= */}
        <div className="border-b border-gray-300 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Kunjungan Perpustakaan
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Data jadwal dan riwayat kunjungan kelas
          </p>
        </div>

        {/* ================= FORM ================= */}
        <div className="bg-white/40 backdrop-blur rounded-2xl shadow p-4 md:p-6">
          <FormKunjungan />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white/30 rounded-2xl shadow text-gray-900">

          {data.length === 0 ? (
            <div className="py-10 text-center text-gray-600">
              Belum ada data kunjungan
            </div>
          ) : (
            <div className="overflow-x-auto px-2 pb-2">
              <table className="min-w-[600px] md:min-w-full text-sm">

                <thead className="bg-gray-100/40">
                  <tr>
                    <Th>No</Th>
                    <Th>Kelas</Th>
                    <Th>Tanggal</Th>
                    <Th>Hari</Th>
                    <Th>Jam</Th>
                    <Th>Guru</Th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, i) => (
                    <tr
                      key={item.id}
                      className="
                        border-t border-white/30
                        hover:bg-white/20
                        transition
                      "
                    >
                      <Td>{i + 1}</Td>
                      <Td className="font-medium">{item.kelas}</Td>
                      <Td>
                        {item.tanggal.toLocaleDateString("id-ID")}
                      </Td>
                      <Td>
                        {item.tanggal.toLocaleDateString("id-ID", {
                          weekday: "long",
                        })}
                      </Td>
                      <Td>{item.jam}</Td>
                      <Td>{item.guru}</Td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

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
    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
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
    <td className={`px-3 py-3 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}