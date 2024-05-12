"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Shelf } from "@prisma/client";

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
import { CategorySchema } from "@/schemas";
import { updateShelf } from "@/actions/updateShelf";
import { createShelf } from "@/actions/createShelf";
import { deleteShelf } from "@/actions/deleteShelf";

type CategoryFormValues = z.infer<typeof CategorySchema>;

interface CategoryFormProps {
  initialData: Shelf | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit shelf" : "Create shelf";
  const description = initialData ? "Edit a shelf." : "Add a new shelf";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CategorySchema>) => {
    startTransition(() => {
      initialData &&
        initialData.id &&
        updateShelf(values, initialData.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/shelves/" + initialData.id);
            }
          })
          .catch(() => toast.error("Something went wrong"));
      !initialData &&
        createShelf(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/shelves/");
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
              window.location.assign("/dashboard/shelves");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Shelf name" {...field} />
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
