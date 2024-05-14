"use server";

import { MemberSchema } from "@/schemas";
import * as z from "zod";
import db from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export const createMember = async (
  values: z.infer<typeof MemberSchema>,
  image: string | undefined
) => {
  const validatedFields = MemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, email, password, phone, address, post } = validatedFields.data;

  const hashedPass = await bcrypt.hash(password, 12);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        image: image ? image : null,
        phone,

        address,
        post,
        role: "MEMBER",
      },
    });
  } catch (error) {
    console.log("MEMBER_CREATE", error);
    return { error: "Something went wrong" };
  }

  return { success: "Member Created !" };
};
