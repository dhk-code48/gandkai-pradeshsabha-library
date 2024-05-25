"use server";
import { Book } from "@prisma/client";
import prismadb from "@/lib/prismadb";

const bulkCreateBook = async (books: Book[]) => {
  try {
    await prismadb.book.createMany({
      data: books.map((book) => ({
        id: book.id,
        name: book.name,
        publication: book.publication || "",
        authors: book.authors || "",
        total: book.total || 1,
        stock: book.total || 1,
        shelfId: book.shelfId,
        shelfCategory: book.shelfCategory,
      })),
    });
  } catch (error) {
    console.log("CREATE_BOOK_ERROR", error);
    return { error: "Something went wrong" };
  }

  return { success: "Book Created !" };
};

export default bulkCreateBook;
