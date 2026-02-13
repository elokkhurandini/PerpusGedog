// app/(admin)/layout.tsx ✅ FINAL
import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-600 p-6">
        {children}
      </main>
    </div>
  );
}

async function getAdminFromCookies() {
  const cookieStore = await cookies();
  const adminId = cookieStore.get("admin_login")?.value;

  if (!adminId) return null;

  return prisma.user.findUnique({
    where: {
      id: Number(adminId),
      role: "admin",
    },
  });
}