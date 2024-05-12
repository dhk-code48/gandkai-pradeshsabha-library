import { auth } from "@/auth";
import { UserButton } from "@/components/user-button";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const MemberLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "MEMBER") {
    session.user.role === "ADMIN" ? redirect("/dashboard") : redirect("/auth/login");
  }
  return (
    <div>
      <div className="container py-5 border-b flex items-center justify-between">
        <div className="flex gap-x-5">
          <Image
            src="/gandakipradesh.png"
            className="w-[70px]"
            width={100}
            height={70}
            alt="Logo"
          />
          <div>
            <h1 className="text-xl font-bold">Gandkai Pradeshsabha Library</h1>
            <p>Nadipur - Pokhara, nepal</p>
          </div>
        </div>
        <UserButton userName={session.user.name} email={session.user.email} />
      </div>
      {children}
    </div>
  );
};

export default MemberLayout;
