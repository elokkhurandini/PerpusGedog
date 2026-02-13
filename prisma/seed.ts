import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";


async function main() {
  const email = "admin@perpus.com"
  const plainPassword = "admin123"

  const passwordHash = await bcrypt.hash(plainPassword, 10)

  await prisma.user.upsert({
    where: { email },
    update: {
      // kalau admin sudah ada, update password & role
      password: passwordHash,
      role: "admin",
    },
    create: {
      nama: "Admin Perpus",
      email,
      password: passwordHash,
      role: "admin",
    },
  })

  console.log("✅ Admin berhasil dibuat / diperbarui")


  
}

main()
  .catch((error) => {
    console.error("❌ Seed admin gagal:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })