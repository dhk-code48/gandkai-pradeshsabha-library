"use server";

import prismadb from "@/lib/prismadb";

export const deleteBook = async (bookId: string) => {
  try {
    await prismadb.book.delete({
      where: {
        id: bookId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Book Deleted Success" };
};
