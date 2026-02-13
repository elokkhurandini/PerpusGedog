"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function tambahKunjungan(formData: FormData) {
  const kelas = formData.get("kelas") as string;
  const tanggal = formData.get("tanggal") as string;
  const jam = formData.get("jam") as string;
  const guru = formData.get("guru") as string;

  if (!kelas || !tanggal || !jam || !guru) return;

  await prisma.kunjungan.create({
    data: {
      kelas,
      tanggal: new Date(tanggal),
      jam,
      guru,
    },
  });

  revalidatePath("/kunjungan");
}
