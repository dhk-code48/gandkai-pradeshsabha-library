"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Heading } from "@/components/ui/heading";

import { BookColumns } from "./columns";
import { Book } from "@prisma/client";
import Link from "next/link";

interface BooksClientProps {
  data: Book[];
}

export const BooksClient: React.FC<BooksClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Books (${data.length})`} description="Manage books for your school" />
        <div className="flex items-center gap-x-5">
          <Button onClick={() => router.push(`/dashboard/books/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>

          <Link className={buttonVariants()} href="/dashboard/books/bulkImport">
            Bulk Registration
          </Link>
        </div>
      </div>

      <DataTable searchKey="name" columns={BookColumns} data={data} />
    </>
  );
};
