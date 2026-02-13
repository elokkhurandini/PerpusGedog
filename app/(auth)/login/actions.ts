"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"


export async function loginAdmin(formData: FormData): Promise<void> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    redirect("/login?error=empty")
  }

  const admin = await prisma.user.findUnique({
    where: { 
      email,
      role: "admin", 
    }
  })


  if (!admin || admin.role !== "admin") {
    redirect("/login?error=notfound")
  }

  const valid = await bcrypt.compare(password, admin.password)

  if (!valid) {
    redirect("/login?error=wrongpass")
  }

  (await cookies()).set("admin_login", admin.id.toString(), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 hari
  })

  redirect("/dashboard")
}
