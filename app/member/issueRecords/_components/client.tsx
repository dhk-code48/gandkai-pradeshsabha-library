"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, IssueRecordColumn } from "./columns";

interface CategoriesClientProps {
  data: IssueRecordColumn[];
}

export const IssueRecordsClient: React.FC<CategoriesClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Issue Records (${data.length})`}
          description="Manage Issue Records for your site"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
