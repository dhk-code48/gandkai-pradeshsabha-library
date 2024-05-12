"use server";
import fs, { writeFile } from "fs";

const uploadImage = async (imageFile: File | null, bookId: string) => {
  try {
    const byteData = await new Response(imageFile as Blob).arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/img/${bookId}.jpg`;

    writeFile(path, buffer, (error) => console.log("Error => ", error));
  } catch (error) {
    console.log("ERROR_AT_UPLOADIMAGE => ", error);
    return { error: "Image Not Uploaded" };
  }
  return { success: "Image Uploaded" };
};

export default uploadImage;
