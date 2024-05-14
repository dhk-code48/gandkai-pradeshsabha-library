"use server";

import { BookSchema } from "@/schemas";
import * as z from "zod";
import db from "@/lib/prismadb";
import prismadb from "@/lib/prismadb";

export const createBook = async (values: z.infer<typeof BookSchema>) => {
  const validatedFields = BookSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const {
    name,
    authors,
    category,
    shelfCategory,
    shelfId,
    description,
    publishedDate,
    id,
    price,
    publication,
    stock,
    totalPages,
  } = validatedFields.data;

  try {
    await db.book.create({
      data: {
        name,
        authors,
        imageUrl: id + ".jpg",
        price,
        publication,
        stock: parseInt(stock),
        totalPages,
        category,
        shelfCategory: shelfCategory.toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 1,
        description,
        publishedDate,
        shelfId,
        total: parseInt(stock),
        id,
      },
    });
  } catch (error) {
    console.log("CREATE_BOOK_ERROR", error);
    return { error: "Something went wrong" };
  }

  return { success: "Book Created !" };
};
