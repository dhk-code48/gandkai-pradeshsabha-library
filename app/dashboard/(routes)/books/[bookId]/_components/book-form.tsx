"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Book, Shelf } from "@prisma/client";

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
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookSchema } from "@/schemas";
import { updateBook } from "@/actions/updateBook";
import { deleteBook } from "@/actions/deleteBook";
import { AlertModal } from "@/components/modals/alert-modal";
import { createBook } from "@/actions/createBook";
import uploadImage from "@/actions/uploadImage";
import Image from "next/image";

type ProductFormValues = z.infer<typeof BookSchema>;

interface BookFormProps {
  initialData: Book | null;
  shelfs: Shelf[] | null;
}

export const BookForm: React.FC<BookFormProps> = ({ initialData, shelfs }) => {
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Book" : "Create Book";
  const description = initialData ? "Edit a Book." : "Add a new Book";
  const action = initialData ? "Save changes" : "Create";

  const [file, setFile] = useState<File | null>(null);

  const defaultValues = {
    id: initialData?.id || "",
    imageUrl: initialData?.imageUrl || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    authors: initialData?.authors || "",
    publication: initialData?.publication || "",
    shelfId: initialData?.shelfId || "",
    shelfCategory: initialData?.shelfCategory.toString() || "",
    price: initialData?.price || "",
    totalPages: initialData?.totalPages || "",
    publishedDate: initialData?.publishedDate || "",
    category: initialData?.category || "",
    stock: initialData?.stock.toString() || "",
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(BookSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof BookSchema>) => {
    startTransition(async () => {
      initialData &&
        initialData.id &&
        updateBook(values, initialData.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/books/" + initialData.id);
            }
          })
          .catch(() => toast.error("Something went wrong"));

      !initialData &&
        createBook(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/books/");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = async () => {
    startTransition(() => {
      initialData &&
        deleteBook(initialData.id)
          .then((data) => {
            if (data?.error) {
              toast.error("Error while deleting");
            }
            if (data?.success) {
              toast.success("Successfullt deleated");
              window.location.assign("/dashboard/books");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  useEffect(() => {
    console.log(file?.name.split(".")[1]);
  }, [file]);

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
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id / Qr</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    className="w-fit"
                    type="text"
                    placeholder="Enter Qr code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:grid md:grid-cols-3 gap-y-8 gap-x-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Name *</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Book name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter book description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Publication *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter Publication Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Author Name *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter Author Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Book Available *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter the amount of book in stock"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shelfId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf Number</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Shelf Number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shelfs &&
                        shelfs.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shelfCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf Category (A/B/C/D/E) *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter book category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="text" disabled={isPending} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalPages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Pages</FormLabel>
                  <FormControl>
                    <Input type="text" disabled={isPending} placeholder="645" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter book category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Published Date</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter book published date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
