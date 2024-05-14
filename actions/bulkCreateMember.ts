"use server";
import { User } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { saveImageToPublic } from "./saveImage";

const bulkCreateMember = async (members: User[]) => {
  try {
    members.forEach(async (member) => {
      const hashedPass = await bcrypt.hash("member123", 12);
      const image = await saveImageToPublic(member?.image || "", member.id);
      await prismadb.user.create({
        data: {
          image: image.imageUrl,
          name: member.name,
          email: member.email,
          password: hashedPass,
          address: member.address,
          phone: member.phone,
          memeberId: member.memeberId,
          post: member.post,
          id: member.id,
          role: "MEMBER",
        },
      });
    });
  } catch (error) {
    console.log("CREATE_Members_ERROR");
    return { error: "Something went wrong" };
  }

  return { success: "Members Created !" };
};

export default bulkCreateMember;
