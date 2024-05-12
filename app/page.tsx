import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  } else if (session.user.role === "ADMIN") {
    redirect("/dashboard");
  } else if (session.user.role === "MEMBER") {
    redirect("/member");
  }

  return <></>;
}
