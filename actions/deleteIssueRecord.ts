"use server";

import prismadb from "@/lib/prismadb";

export const deleteIssueRecord = async (id: string, bookId: string) => {
  try {
    await prismadb.issueRecord.delete({
      where: {
        id,
      },
    });
    await prismadb.book.update({
      where: {
        id: bookId,
      },
      data: {
        stock: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Issue Record Deleted" };
};
