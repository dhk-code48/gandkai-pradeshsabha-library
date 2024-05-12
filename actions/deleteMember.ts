"use server";

import prismadb from "@/lib/prismadb";

export const deleteMember = async (id: string) => {
  try {
    await prismadb.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Member Deleted Success" };
};
