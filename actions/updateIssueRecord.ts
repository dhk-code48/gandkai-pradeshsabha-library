"use server";

import db from "@/lib/prismadb";

export const updateIssueRecord = async (
  id: string,
  returnState: boolean,
  bookId: string,
  bookName: string,
  userName: string,
  userId: string,
  issuedDate: Date
) => {
  try {
    await db.returnRecord.create({
      data: {
        bookId,
        bookName,
        userId,
        userName,
        issuedDate,
      },
    });
    await db.issueRecord.delete({
      where: { id },
    });
    await db.book.update({
      where: { id: bookId },
      data: {
        stock: {
          increment: returnState ? 1 : 0,
        },
      },
    });
  } catch (error) {
    console.log("ERROR => ", error);
    return { error: "Something went wrong" };
  }

  return { success: "Issue Updated !" };
};
