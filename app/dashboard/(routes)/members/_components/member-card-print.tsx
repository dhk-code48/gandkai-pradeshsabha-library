import MemberLibraryCard from "@/components/member-library-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Printer, X } from "lucide-react";
import React from "react";

const MemberCardPrint = ({
  isOpen,
  close,
  user,
}: {
  isOpen: boolean;
  close: () => void;
  user: User;
}) => {
  function handlePrint() {
    print();
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-50 w-screen h-screen bg-white",
        isOpen ? "block" : "hidden"
      )}
    >
      <div className="fixed z-[60] top-10 right-10 flex flex-col gap-y-5">
        <Button variant="destructive" onClick={close}>
          <X />
        </Button>
        <Button className="gap-x-3" onClick={handlePrint}>
          Print <Printer size={18} />
        </Button>
      </div>
      <MemberLibraryCard user={user} />
    </div>
  );
};

export default MemberCardPrint;
