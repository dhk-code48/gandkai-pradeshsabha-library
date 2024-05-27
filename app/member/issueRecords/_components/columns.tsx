"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Book } from "@prisma/client";
import BookImage from "@/components/book-img";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type IssueRecordColumn = {
  id: string;
  userName: string;
  userId: string;
  book: Book;
  bookId: string;
  createdAt: string;
  issuedDate: Date;
};

function calculateDaysBetweenDates(date1: Date, date2: Date) {
  // Create Date objects from the input dates

  // Get the time values in milliseconds
  const startTime = date2.getTime();
  const endTime = date1.getTime();

  // Calculate the difference in milliseconds
  const timeDifference = endTime - startTime;
  console.log("date 1", date1);
  console.log("date 2", date2);

  // Convert the difference from milliseconds to days
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const daysDifference = timeDifference === 0 ? 1 : timeDifference / millisecondsInADay;

  // Return the number of days
  return Math.ceil(daysDifference);
}

export const columns: ColumnDef<IssueRecordColumn>[] = [
  {
    accessorKey: "userName",
    header: "Member Name",
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
    cell: ({ row }) => {
      const createdAt: string = row.getValue("createdAt");
      return <div>{moment(new Date(createdAt)).format("MMMM Do YYYY").toString()}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No Of Days
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const daysA = calculateDaysBetweenDates(new Date(), new Date(rowA.original.createdAt));
      const daysB = calculateDaysBetweenDates(new Date(), new Date(rowB.original.createdAt));
      return daysA - daysB;
    },
    cell: ({ row }) => {
      const createdAt: string = row.getValue("createdAt");
      const noOfDays = calculateDaysBetweenDates(new Date(), new Date(createdAt));
      console.log("createAt", createdAt);
      return (
        <div className={cn(noOfDays >= 30 && "bg-red-500 w-fit px-3 py-1 rounded-lg text-white")}>
          {noOfDays} days
        </div>
      );
    },
  },
  {
    accessorKey: "bookId",
    header: "Book Id",
  },
];
