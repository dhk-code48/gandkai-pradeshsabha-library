"use server";

import { BookSchema } from "@/schemas";
import * as z from "zod";
import prismadb from "@/lib/prismadb";

export const updateBook = async (values: z.infer<typeof BookSchema>, batchId: string) => {
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
    await prismadb.book.update({
      where: {
        id: batchId,
      },
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
    return { error: "Something went wrong" };
  }

  return { success: "Book Updated!" };
};
