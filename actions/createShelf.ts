"use server";

import { CategorySchema } from "@/schemas";
import * as z from "zod";
import db from "@/lib/prismadb";

export const createShelf = async (values: z.infer<typeof CategorySchema>) => {
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name } = validatedFields.data;

  try {
    await db.shelf.create({
      data: {
        name,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Shelf Created !" };
};
