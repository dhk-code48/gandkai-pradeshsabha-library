"use client";

import { ColumnDef } from "@tanstack/react-table";
import BookImage from "@/components/book-img";

export type IssueRecordColumn = {
  id: string;
  name: string;
  book: string;
  createdAt: string;
};

export const columns: ColumnDef<IssueRecordColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "book",
    header: "Book",
    cell: ({ row }) => {
      const book: string = row.getValue("book");
      return (
        <div className="flex items-center gap-x-5">
          <BookImage />
          {book}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
