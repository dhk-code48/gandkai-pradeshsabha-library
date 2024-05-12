import { NextRequest, NextResponse } from "next/server";
import fs, { writeFile } from "fs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const img = data.get("img");
    const id = data.get("id")?.toString();

    if (!img || !id) {
      return new Response(JSON.stringify({ message: "Incomplete data" }), {
        status: 400,
      });
    }

    const byteData = await new Response(img as Blob).arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/img/${id}`;

    writeFile(path, buffer, (err) => {
      console.log("ERROR => ", err);
    });

    return new Response(
      JSON.stringify({
        message: "Image Uploaded",
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("ERROR => ", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.formData();
    const img = data.get("img");
    const id = data.get("id")?.toString();

    if (!img) {
      return new Response(JSON.stringify({ error: "Incomplete data" }), {
        status: 400,
      });
    }

    if (img) {
      const byteData = await new Response(img as Blob).arrayBuffer();
      const buffer = Buffer.from(byteData);
      const path = `./public/img/${id}`;

      writeFile(path, buffer, (err) => {
        console.log("ERROR => ", err);
      });
    }

    return new Response(
      JSON.stringify({
        message: "Worksheet Created",
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("ERROR => ", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
