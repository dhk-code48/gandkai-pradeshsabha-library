"use client";

import { useState, useTransition } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteIssueRecord } from "@/actions/deleteIssueRecord";
import { updateIssueRecord } from "@/actions/updateIssueRecord";
import { IssueRecordColumn } from "./columns";

interface CellActionProps {
  data: IssueRecordColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const [openUpdateAlert, setOpenUpdateAlert] = useState(false);
  const [isUpdatePending, startUpdateTransition] = useTransition();

  const handleDelete = async () => {
    startDeleteTransition(() => {
      data &&
        deleteIssueRecord(data.id, data.book.id)
          .then((data) => {
            if (data?.error) {
              toast.error("Error while deleting");
            }
            if (data?.success) {
              toast.success("Successfully deleated");
              window.location.assign("/dashboard/issueRecords");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };
  const handleUpdate = async () => {
    startUpdateTransition(() => {
      data &&
        updateIssueRecord(
          data.id,
          true,
          data.book.id,
          data.book.name,
          data.userName,
          data.userId,
          data.issuedDate
        )
          .then((data) => {
            if (data?.error) {
              toast.error("Error while deleting");
            }
            if (data?.success) {
              toast.success("Successfully renewed");
              window.location.assign("/dashboard/issueRecords");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <>
      <AlertModal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        onConfirm={handleDelete}
        loading={isDeletePending}
      />

      <AlertModal
        isOpen={openUpdateAlert}
        onClose={() => setOpenUpdateAlert(false)}
        onConfirm={handleUpdate}
        message="Are you sure you want to renew the book ?"
        variant="secondary"
        loading={isUpdatePending}
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
          <DropdownMenuItem onClick={() => setOpenUpdateAlert(true)}>
            <Edit className="mr-2 h-4 w-4" /> Return Book
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDeleteAlert(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
