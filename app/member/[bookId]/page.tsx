import prismadb from "@/lib/prismadb";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const HomeBookPage = async ({ params }: { params: { bookId: string } }) => {
  const book = await prismadb.book.findUnique({
    where: {
      id: params.bookId,
    },
  });
  if (!book) {
    redirect("/books");
  }
  return (
    <div className="container space-y-10">
      <div className="flex lg:justify-stretch flex-wrap justify-center mt-10 gap-10">
        <Image
          src={"/book.jpg"}
          width={300}
          height={400}
          className="rounded-xl"
          alt="background of card"
        />
        <div className="flex gap-y-10 text-center lg:text-left flex-col">
          <div>
            <h1 className="font-bold text-3xl">{book.name}</h1>
            <p className="text-muted-foreground mt-1">Category : {book.category}</p>
            <p className="text-muted-foreground mt-1">Price : {book.price}</p>
            <p className="text-muted-foreground mt-1">Pages : {book.totalPages}</p>
          </div>
          <div className="flex gap-x-5 items-center">
            <p className="font-bold  tracking-wide mb-2">Authors : </p>
            <p className="text-sm">{book.authors}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBookPage;
