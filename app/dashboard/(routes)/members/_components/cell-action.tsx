"use client";

import { useState, useTransition } from "react";
import { Copy, Edit, Library, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, IssueRecord, User } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteMember } from "@/actions/deleteMember";
import MemberCardPrint from "./member-card-print";

interface CellActionProps {
  data: User & { issueRecords: (IssueRecord & { book: Book })[] };
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onConfirm = async () => {
    startTransition(() => {
      data &&
        deleteMember(data.id)
          .then((data) => {
            if (data?.error) {
              toast.error("Delete All Issue Related to the member first !!");
            }
            if (data?.success) {
              toast.success("Successfullt deleated");
              window.location.assign("/dashboard/members");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  const [isMemberCardOpen, setIsMemberCardOpen] = useState<boolean>(false);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
      />
      <MemberCardPrint
        user={data}
        isOpen={isMemberCardOpen}
        close={() => setIsMemberCardOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsMemberCardOpen(true)}>
            <Library className="mr-2 h-4 w-4" /> Generate Id
          </DropdownMenuItem>{" "}
          <DropdownMenuItem onClick={() => router.push(`/dashboard/members/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
