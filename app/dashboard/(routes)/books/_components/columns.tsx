"use client";

import { Book } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import BookImage from "@/components/book-img";

export const BookColumns: ColumnDef<Book>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const url: string = row.getValue("imageUrl");
      return <BookImage url={url} />;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "id",
    header: "Book Id",
  },

  {
    accessorKey: "authors",
    header: "Authors",
  },
  {
    accessorKey: "stock",
    header: "In Stock",
  },
  {
    accessorKey: "total",
    header: "Total Books",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
