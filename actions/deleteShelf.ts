"use server";

import prismadb from "@/lib/prismadb";

export const deleteShelf = async (categoryId: string) => {
  try {
    await prismadb.shelf.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Category Deleted Success" };
};
