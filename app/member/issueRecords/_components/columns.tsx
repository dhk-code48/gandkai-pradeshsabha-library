"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Book } from "@prisma/client";
import BookImage from "@/components/book-img";

export type IssueRecordColumn = {
  id: string;
  userName: string;
  userId: string;
  book: Book;
  bookId: string;
  createdAt: string;
  issuedDate: Date;
};

export const columns: ColumnDef<IssueRecordColumn>[] = [
  {
    accessorKey: "userName",
    header: "Name",
  },
  {
    accessorKey: "book",
    header: "Book",
    cell: ({ row }) => {
      const book: Book = row.getValue("book");
      return (
        <div className="flex items-center gap-x-5">
          <BookImage />
          {book.name}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "bookId",
    header: "Book Id",
  },
];
