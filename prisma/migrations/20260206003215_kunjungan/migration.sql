/*
  Warnings:

  - The `status` column on the `Peminjaman` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusPeminjaman" AS ENUM ('dipinjam', 'dikembalikan');

-- AlterTable
ALTER TABLE "Peminjaman" ADD COLUMN     "tanggalDikembalikan" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusPeminjaman" NOT NULL DEFAULT 'dipinjam';

-- CreateTable
CREATE TABLE "Kunjungan" (
    "id" SERIAL NOT NULL,
    "kelas" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jam" TEXT NOT NULL,
    "guru" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kunjungan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Peminjaman_status_idx" ON "Peminjaman"("status");

-- CreateIndex
CREATE INDEX "Peminjaman_tanggalPinjam_idx" ON "Peminjaman"("tanggalPinjam");

-- CreateIndex
CREATE INDEX "Peminjaman_tanggalKembali_idx" ON "Peminjaman"("tanggalKembali");

-- CreateIndex
CREATE INDEX "Peminjaman_tanggalDikembalikan_idx" ON "Peminjaman"("tanggalDikembalikan");
