"use server";
import { Book } from "@prisma/client";
import prismadb from "@/lib/prismadb";

const bulkCreateBook = async (books: Book[]) => {
  try {
    books.forEach(async (book) => {
      await prismadb.book.create({
        data: {
          id: book.id,
          name: book.name,
          publication: book.publication,
          authors: book.authors,
          total: book.total,
          stock: book.total,
          shelfId: book.shelfId,
          shelfCategory: book.shelfCategory,
        },
      });
    });
  } catch (error) {
    console.log("CREATE_BOOK_ERROR");
    return { error: "Something went wrong" };
  }

  return { success: "Book Created !" };
};

export default bulkCreateBook;
