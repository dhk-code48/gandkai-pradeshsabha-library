"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
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

type CategoryFormValues = z.infer<typeof IssueRecordSchema>;

interface CategoryFormProps {
  initialData: (IssueRecord & { book: Book; user: User }) | null;
  users: User[];
}

export const IssueForm: React.FC<CategoryFormProps> = ({ initialData, users }) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit issue" : "Create issue";
  const description = initialData ? "Edit a issue." : "Add a new issue";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(IssueRecordSchema),
    defaultValues: {
      memberId: initialData?.user.id || "",
    },
  });

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

  function handleAdd() {
    setBooks((prev) => [...prev, ""]);
  }
  function handleDelete(i: number) {
    setBooks((prev) => {
      let deleteVal = [...prev];
      deleteVal.splice(i, 1);
      return deleteVal;
    });
  }
  function handleChange(i: number, value: string) {
    setBooks((prev) => {
      let newVal = [...prev];
      newVal[i] = value;
      if (value.length >= 10) {
        fetchBook(value, i);
      }
      return newVal;
    });
  }

  useEffect(() => {
    console.log("Book Info = ", bookInfo);
  }, [bookInfo]);

  const onSubmit = (values: z.infer<typeof IssueRecordSchema>) => {
    startTransition(() => {
      !initialData &&
        createIssueRecord(values.memberId, books)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
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
        deleteShelf(initialData.id)
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
    users &&
      users.forEach((member) =>
        setMembersOptions((prev) => [
          ...prev,
          { label: member.name + " (" + member.phone + ")", value: member.id },
        ])
      );
  }, [users]);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="gap-8 flex flex-col items-start">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Name Here</FormLabel>
                  <FormControl>
                    <ReactSelect
                      className="basic-single min-w-[300px]"
                      classNamePrefix="select"
                      onChange={(e) => field.onChange(e ? e.value : "")}
                      isLoading={isPending}
                      defaultValue={{
                        value: initialData?.user.id,
                        label: initialData?.user.name + " (" + initialData?.user.phone + ")",
                      }}
                      isClearable={true}
                      isSearchable={true}
                      name="member"
                      options={membersOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {books.map((book, i) => {
                return (
                  <div key={"return" + book + i} className="flex flex-wrap mt-5 gap-5 items-center">
                    <div className="flex gap-x-5 items-center mb-2">
                      <Input
                        name={i.toString()}
                        value={books[i]}
                        placeholder="Scan Qr while focusing here"
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
                        <Image
                          src={bookInfo[i]?.imageUrl || ""}
                          alt="book banner"
                          width={100}
                          height={300}
                          className="rounded-xl"
                        />
                        <div className="flex gap-y-1 flex-col items-start">
                          <p className="font-bold text-gray-800">Name : {bookInfo[i]?.name}</p>
                          <p className="text-sm text-gray-700">In Stock : {bookInfo[i]?.stock}</p>
                          <p className="text-sm text-gray-700">
                            Total Copies : {bookInfo[i]?.total}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <br />
              <Button type="button" onClick={() => handleAdd()}>
                Add Book
              </Button>
            </div>
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
