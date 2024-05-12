"use server";

import { MemberSchema } from "@/schemas";
import * as z from "zod";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export const updateMember = async (values: z.infer<typeof MemberSchema>, id: string) => {
  const validatedFields = MemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, email, password, image, phone, address, post } = validatedFields.data;
  const hashedPass = await bcrypt.hash(password, 12);

  try {
    await prismadb.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password: hashedPass,
        image,
        phone,
        address,
        post,
        role: "MEMBER",
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Member Updated !" };
};
