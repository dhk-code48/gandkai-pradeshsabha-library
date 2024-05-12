import { UserButton } from "@/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package2Icon } from "lucide-react";
import prismadb from "@/lib/prismadb";

export const Navbar = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <header className="flex h-[64px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Link className="lg:hidden" href="#">
        <Package2Icon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <MobileSidebar />
      <UserButton email={session.user.email} userName={session.user.name} />
    </header>
  );
};
