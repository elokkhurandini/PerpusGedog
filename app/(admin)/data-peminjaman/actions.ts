"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function kembalikanBuku(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) return;

  await prisma.peminjaman.update({
    where: { id },
    data: {
      status: "dikembalikan",
      tanggalDikembalikan: new Date(),
    },
  });

  revalidatePath("/data-peminjaman");
  revalidatePath("/pengembalian");
}
