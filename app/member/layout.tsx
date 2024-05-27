import { auth } from "@/auth";
import { UserButton } from "@/components/user-button";
import Image from "next/image";
import Link from "next/link";
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
    <div className="mb-20">
      <div className="container py-5 border-b flex items-center justify-between">
        <div className="flex gap-x-5">
          <Image src="/logo.jpg" className="w-[70px]" width={100} height={70} alt="Logo" />
          <div>
            <h1 className="text-xl font-bold text-red-500">गण्डकी प्रदेश सभा पुस्तकालय</h1>
            <p className="text-blue-700 font-bold">नदीपुर-पोखरा, नेपाल</p>
          </div>
        </div>
        <div className="space-x-10">
          <Link className="font-semibold" href="/member">
            Books
          </Link>
          <Link className="font-semibold" href="/member/issueRecords">
            Issue Record
          </Link>
          <Link className="font-semibold" href="/user-manual-member.pdf" target="_blank">
            User Manual
          </Link>
          <UserButton userName={session.user.name} email={session.user.email} />
        </div>
      </div>
      <div className="container mt-10">{children}</div>
    </div>
  );
};

export default MemberLayout;
