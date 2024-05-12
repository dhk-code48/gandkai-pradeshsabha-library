"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, IssueRecordColumn } from "./columns";

interface CategoriesClientProps {
  data: IssueRecordColumn[];
}

export const IssueRecordsClient: React.FC<CategoriesClientProps> = ({
  data,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Renew Records (${data.length})`}
          description="Manage renew Records for your site"
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
