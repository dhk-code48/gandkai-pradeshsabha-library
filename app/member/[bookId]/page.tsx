import { Button, buttonVariants } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { cn } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
      <Link className={buttonVariants({ variant: "outline", className: "mt-10" })} href="/member">
        <MoveLeft />
      </Link>
      <div className="flex lg:justify-stretch flex-wrap justify-center mt-10 gap-10">
        <Image
          src={"/book.png"}
          width={300}
          height={400}
          className="rounded-xl"
          alt="background of card"
        />
        <div className="flex gap-y-10 text-center lg:text-left flex-col">
          <div>
            <h1 className="font-bold text-3xl">{book.name}</h1>
            <p className="text-muted-foreground mt-1">Publication : {book.publication}</p>
            <p className="text-muted-foreground mt-1">Authors : {book.authors}</p>
            <p className="text-muted-foreground mt-1">
              Shelf Number : {book.shelfId} ` {String.fromCharCode(64 + book.shelfCategory)} `
            </p>
          </div>
          <div className="gap-x-5 items-center">
            <p className="text-muted-foreground mt-1">
              <strong className="text-gray-900">Total Book In Stock </strong>: {book.stock}
            </p>
            <p className="text-muted-foreground mt-1">
              <strong className="text-gray-900">Total Book Issued </strong>:{" "}
              {book.total - book.stock}
            </p>{" "}
            <div
              className={cn(
                "px-3 rounded-full w-fit",
                book.stock > 0 ? "bg-green-500" : "bg-red-500"
              )}
            >
              {book.stock > 0 ? "Available" : "Out of stock"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBookPage;
