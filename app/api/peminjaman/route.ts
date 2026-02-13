import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function POST(req: Request) {
  try {
    const body = await req.json();

    const tanggalPinjam = new Date();
    const tanggalKembali = new Date();
    tanggalKembali.setDate(tanggalKembali.getDate() + 7);

    const result = await prisma.peminjaman.create({
      data: {
        judulBuku: body.judulBuku,
        pengarang: body.pengarang,
        penerbit: body.penerbit,
        namaSiswa: body.namaSiswa,
        kelas: body.kelas,
        tanggalPinjam,
        tanggalKembali,
        status: "dipinjam",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("❌ ERROR ASLI:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
