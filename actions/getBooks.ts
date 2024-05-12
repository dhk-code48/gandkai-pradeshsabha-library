"use server";
import prismadb from "@/lib/prismadb";

export async function fetchBooks(page: number, limit: number, bookName: string) {
  try {
    // Fetch books with pagination options
    const books = await prismadb.book.findMany({
      where: {
        name: { contains: bookName },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Log fetched books for debugging
    console.log("Fetched books:", books);

    // Check if books are falsy or empty
    if (!books || books.length === 0) {
      throw new Error("No books found");
    }

    const totalBooks = await prismadb.book.count({
      where: {
        name: { contains: bookName },
      },
    });

    // Return fetched books along with pagination details
    return {
      books,
      pagination: {
        page: page,
        limit: limit,
        totalCount: totalBooks, // This may not be the total count; consider querying total count separately
      },
    };
  } catch (error) {
    console.error("Failed to fetch books:", error);

    // Handle errors gracefully and return default values
    return {
      books: [],
      pagination: {
        page: 1,
        limit: limit,
        totalCount: 0,
      },
    };
  }
}
