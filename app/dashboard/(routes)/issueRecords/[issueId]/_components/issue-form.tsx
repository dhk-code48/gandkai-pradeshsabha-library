"use client";

import * as z from "zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Minus, Trash } from "lucide-react";
import { Book, IssueRecord, User } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { IssueRecordSchema } from "@/schemas";
import { deleteShelf } from "@/actions/deleteShelf";
import ReactSelect from "react-select";
import { createIssueRecord } from "@/actions/createIssueRecord";
import { updateIssueRecord } from "@/actions/updateIssueRecord";
import { getBookById } from "@/actions/getBookById";
import Image from "next/image";
import { deleteIssueRecord } from "@/actions/deleteIssueRecord";
import BookImage from "@/components/book-img";

// type CategoryFormValues = z.infer<typeof IssueRecordSchema>;

interface CategoryFormProps {
  initialData: (IssueRecord & { book: Book; user: User }) | null;
  members: User[];
}

export const IssueForm: React.FC<CategoryFormProps> = ({ initialData, members }) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit issue" : "Issue Book";
  const description = initialData ? "Edit a issue." : "Issue a book to member";
  const action = initialData ? "Save changes" : "Issue Book";

  const defaultValues = {
    memberId: initialData ? initialData.userId : "",
  };

  // const form = useForm<CategoryFormValues>({
  //   resolver: zodResolver(IssueRecordSchema),
  //   defaultValues,
  // });

  const [memberId, setUserId] = useState<string>("");

  const [books, setBooks] = useState<string[]>([""]);
  const [bookInfo, setBookInfo] = useState<(Book | null)[]>([]);
  async function fetchBook(bookId: string, i: number) {
    console.log("FETCHING => ", bookId);
    const bookInfo = await getBookById(bookId);
    console.log(bookInfo);

    setBookInfo((prev) => {
      let newInfo = [...prev];
      newInfo[i] = bookInfo;
      return newInfo;
    });
  }

  useEffect(() => {
    if (initialData) {
      setBooks(() => [initialData.bookId]);
    }
  }, [initialData]);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, books.length);
  }, [books]);

  function handleAdd() {
    setBooks((prev) => [...prev, ""]);

    setTimeout(() => {
      inputRefs.current[inputRefs.current.length - 1]?.focus();
    }, 0);
  }
  function handleDelete(i: number) {
    setBooks((prev) => {
      let deleteVal = [...prev];
      deleteVal.splice(i, 1);
      return deleteVal;
    });
  }
  function handleChange(i: number, value: string) {
    setBooks((prev) => prev.map((book, index) => (index === i ? value : book)));
    if (value.length >= 10) {
      fetchBook(value, i);
    }
  }

  const onSubmit = () => {
    startTransition(() => {
      !initialData &&
        createIssueRecord(memberId, books)
          .then((data) => {
            if (data?.error) {
              setUserId("");
              toast.error(data.error);
            }

            if (data?.success) {
              setUserId("");
              toast.success(data.success);
              window.location.assign("/dashboard/issueRecords/");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = async () => {
    startTransition(() => {
      initialData &&
        deleteIssueRecord(initialData.id, initialData.book.id)
          .then((data) => {
            if (data?.error) {
              toast.error("Error while deleting");
            }
            if (data?.success) {
              toast.success("Successfullt deleated");
              window.location.assign("/dashboard/issueRecords");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  const [membersOptions, setMembersOptions] = useState<{ label: string; value: string }[]>([
    { label: "", value: "" },
  ]);

  useEffect(() => {
    setMembersOptions([]);
    members &&
      members.forEach((member) =>
        setMembersOptions((prev) => [
          ...prev,
          { label: member.name + " (" + member.phone + ")", value: member.id },
        ])
      );
  }, [members]);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div className="gap-8 flex flex-col items-start">
        <ReactSelect
          className="basic-single min-w-[300px]"
          classNamePrefix="select"
          onChange={(e) => setUserId(e?.value || "")}
          isLoading={isPending}
          isClearable={true}
          isSearchable={true}
          name="member"
          options={membersOptions}
        />

        <div>
          {books.map((book, i) => {
            return (
              <div key={i} className="flex flex-wrap mt-5 gap-5 items-center">
                <div className="flex gap-x-5 items-center mb-2">
                  <Input
                    key={i} // Add key prop here
                    name={i.toString()}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[i] = el;
                      }
                    }}
                    value={books[i]}
                    placeholder="Scan Qr while focusing here"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    onChange={(e) => handleChange(i, e.target.value)}
                  />
                  <Button
                    onClick={() => handleDelete(i)}
                    size="sm"
                    variant="destructive"
                    type="button"
                  >
                    <Minus size={14} />
                  </Button>
                </div>
                {bookInfo[i] && (
                  <div className="flex gap-x-5">
                    <BookImage url={bookInfo[i]?.imageUrl || ""} />
                    <div className="flex gap-y-1 flex-col items-start">
                      <p className="font-bold text-gray-800">Name : {bookInfo[i]?.name}</p>
                      <p className="text-sm text-gray-700">In Stock : {bookInfo[i]?.stock}</p>
                      <p className="text-sm text-gray-700">Total Copies : {bookInfo[i]?.total}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <br />
          <Button type="button" onClick={() => handleAdd()} variant="outline" size="sm">
            Add Book
          </Button>
        </div>
      </div>
      <Button disabled={isPending} className="ml-auto" onClick={() => onSubmit()}>
        {action}
      </Button>
    </>
  );
};
