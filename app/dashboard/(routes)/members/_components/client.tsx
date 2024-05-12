"use client";

import { Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";

import { MemberColumns } from "./columns";
import { Book, IssueRecord, User } from "@prisma/client";

interface MembersClientProps {
  data: (User & { issueRecords: (IssueRecord & { book: Book })[] })[];
}

export const MembersClient: React.FC<MembersClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Members (${data.length})`} description="Manage members for your library" />
        <div className="flex items-center gap-x-5">
          <Button onClick={() => router.push(`/dashboard/members/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
          <Button onClick={() => router.push(`/dashboard/members/bulkImport`)}>
            <Upload className="mr-2 h-4 w-4" />
            BulkImport
          </Button>
        </div>
      </div>

      <DataTable searchKey="name" columns={MemberColumns} data={data} />
    </>
  );
};
