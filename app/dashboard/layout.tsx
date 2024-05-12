import { redirect } from "next/navigation";

import { Navbar } from "@/app/dashboard/_components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
import { Sidebar } from "@/app/dashboard/_components/sidebar";
import BackButton from "@/components/back-button";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { schoolId: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    session.user.role === "MEMBER" ? redirect("/member") : redirect("/auth/login");
  }

  return (
    <>
      <div className="grid min-h-screen w-full lg:grid-cols-[250px_1fr]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-col">
          <Navbar />
          <main className="h-full lg:max-w-[calc(100vw-280px)] p-3 lg:p-6 space-y-10">
            <BackButton />
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
