"use server";
import db from "@/lib/prismadb";

export const createIssueRecord = async (userId: string, books: string[]) => {
  try {
    books.forEach(async (bookId) => {
      await db.issueRecord.create({
        data: {
          bookId,
          userId,
        },
      });
      await db.book.update({
        where: {
          id: bookId,
        },
        data: {
          stock: {
            increment: -1,
          },
        },
      });
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Record Created !" };
};
