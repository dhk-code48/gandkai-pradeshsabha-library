"use server";

import { MemberSchema } from "@/schemas";
import * as z from "zod";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export const updateMember = async (
  values: z.infer<typeof MemberSchema>,
  initialData: User,
  image: string | undefined
) => {
  const validatedFields = MemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, email, password, phone, address, post } = validatedFields.data;
  const hashedPass = await bcrypt.hash(password, 12);

  try {
    await prismadb.user.update({
      where: {
        id: initialData.id,
      },
      data: {
        name,
        email,
        password: hashedPass,
        image: image ? image : initialData.image,
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
