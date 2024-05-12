"use server";
import prismadb from "@/lib/prismadb";

export const getBookById = async (id: string) => {
  try {
    const book = await prismadb.book.findUnique({
      where: { id },
    });

    return book;
  } catch {
    return null;
  }
};
