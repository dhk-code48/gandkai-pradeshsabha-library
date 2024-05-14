"use client";

import { Book, IssueRecord, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

export const MemberColumns: ColumnDef<User & { issueRecords: (IssueRecord & { book: Book })[] }>[] =
  [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image: string = row.getValue("image");

        return (
          <Image
            src={image ? "/img/" + image : "/avatar.png"}
            width={50}
            height={50}
            alt="User Profile"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },

    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "issueRecords",
      header: "Issued Books",
      cell: ({ row }) => {
        const issueRecords: (IssueRecord & { book: Book })[] = row.getValue("issueRecords");
        return (
          <>
            {issueRecords.length > 0 ? (
              issueRecords.map((record, i) => (
                <div key={record.id + i + 1} className="bg-gray-200 rounded-xl w-fit px-3 py-1">
                  {record.book.name}
                </div>
              ))
            ) : (
              <i>None</i>
            )}
          </>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];
