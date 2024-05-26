"use client";

import { Plus, Printer, SquareUser, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";

import { MemberColumns } from "./columns";
import { Book, IssueRecord, User } from "@prisma/client";
import React, { useCallback, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import MemberCardPrint from "./member-card-print";
import MemberLibraryCard from "@/components/member-library-card";

interface MembersClientProps {
  data: (User & { issueRecords: (IssueRecord & { book: Book })[] })[];
}

export const MembersClient: React.FC<MembersClientProps> = ({ data }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>("old boring text");

  const handleAfterPrint = React.useCallback((): void => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback((): void => {
    console.log("`onBeforePrint` called");
  }, []);
  const handleOnBeforeGetContent = React.useCallback((): Promise<void> => {
    console.log("`onBeforeGetContent` called");
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  React.useEffect(() => {
    if (text === "New, Updated Text!" && typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [text]);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback((): React.ReactElement => {
    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
    // to the root node of the returned component as it will be overwritten.

    // Bad: the `onClick` here will be overwritten by `react-to-print`
    // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

    // Good
    return (
      <Button className="gap-x-3 fixed z-50 top-24 right-10">
        Print <Printer size={14} />
      </Button>
    );
  }, []);
  return (
    <>
      {isOpen && (
        <div className="fixed z-50 top-0 left-0 w-screen h-screen overflow-y-scroll bg-white">
          <div className="flex h-full w-full">
            <ReactToPrint
              content={reactToPrintContent}
              documentTitle="AwesomeFileName"
              onAfterPrint={handleAfterPrint}
              onBeforeGetContent={handleOnBeforeGetContent}
              onBeforePrint={handleBeforePrint}
              removeAfterPrint
              trigger={reactToPrintTrigger}
            />
            {loading && <p className="indicator">onBeforeGetContent: Loading...</p>}
            <div ref={componentRef}>
              {data.map((member, i) => (
                <MemberLibraryCard key={i + "member"} user={member} />
              ))}
            </div>
          </div>
          <div
            id="hideItWhilePrinting"
            className="fixed gap-y-5 top-10 right-10 flex flex-col z-[60]"
          >
            <Button variant="destructive" onClick={() => setIsOpen(false)}>
              <X />
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
