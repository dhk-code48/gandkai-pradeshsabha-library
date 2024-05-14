"use client";

import { Plus, Printer, SquareUser, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";

import { MemberColumns } from "./columns";
import { Book, IssueRecord, User } from "@prisma/client";
import { useCallback, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import MemberCardPrint from "./member-card-print";
import MemberLibraryCard from "@/components/member-library-card";

interface MembersClientProps {
  data: (User & { issueRecords: (IssueRecord & { book: Book })[] })[];
}

export const MembersClient: React.FC<MembersClientProps> = ({ data }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const componentRef = useRef(null);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    removeAfterPrint: true,
  });

  return (
    <>
      {isOpen && (
        <div className="fixed z-50 top-0 left-0 w-screen h-screen overflow-y-scroll bg-white">
          <div ref={componentRef}>
            {data.map((member, i) => {
              return <MemberLibraryCard key={i + "member"} user={member} />;
            })}
          </div>

          <div
            id="hideItWhilePrinting"
            className="fixed gap-y-5 top-10 right-10 flex flex-col z-[60]"
          >
            <Button variant="destructive" onClick={() => setIsOpen(false)}>
              <X />
            </Button>
            <Button className="gap-x-3" onClick={() => handlePrint()}>
              Print <Printer size={14} />
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Heading title={`Members (${data.length})`} description="Manage members for your library" />
        <div className="flex items-center gap-x-5">
          <Button onClick={() => router.push(`/dashboard/members/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
          <Button onClick={() => router.push(`/dashboard/members/bulkImport`)}>
            <Upload className="mr-2 h-4 w-4" />
            BulkImport
          </Button>{" "}
          <Button onClick={() => setIsOpen(true)}>
            <SquareUser className="mr-2 h-4 w-4" />
            Generate Bulk Member Card
          </Button>
        </div>
      </div>

      <DataTable searchKey="name" columns={MemberColumns} data={data} />
    </>
  );
};
