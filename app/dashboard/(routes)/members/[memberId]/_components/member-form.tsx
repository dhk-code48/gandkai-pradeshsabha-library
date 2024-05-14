"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { User } from "@prisma/client";

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
import { MemberSchema } from "@/schemas";
import { updateMember } from "@/actions/updateMember";
import { createMember } from "@/actions/createMember";
import { deleteMember } from "@/actions/deleteMember";

type MemberFormValues = z.infer<typeof MemberSchema>;

interface MemberFormProps {
  initialData: User | null;
}

export const MemberForm: React.FC<MemberFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);

  const title = initialData ? "Edit Member" : "Create Member";
  const description = initialData ? "Edit a Member." : "Add a new Member";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      post: initialData?.post || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof MemberSchema>) => {
    let data = new FormData();
    data.append("img", file || "");
    data.append("id", file?.name || "");

    try {
      const baseurl = process.env.NEXT_PUBLIC_URL;
      const apiUrl = baseurl + "/api/upload";

      if (!baseurl) {
        console.log("NO BASE URL");
        return null;
      }

      await fetch(apiUrl, {
        method: "POST",
        body: data,
      }).then((res) => res && res.json());
    } catch {
      toast.error("Image must be in jpg format");
    }

    startTransition(() => {
      initialData &&
        initialData.id &&
        updateMember(values, initialData, file?.name)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/members/" + initialData.id);
            }
          })
          .catch(() => toast.error("Something went wrong"));
      !initialData &&
        createMember(values, file?.name)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/members/");
            }
          })
          .catch((error) => {
            console.log("ERROR_MEMBER_FORM => ", error);
            toast.error("Something went wrong");
          });
    });
  };

  const onDelete = async () => {
    startTransition(() => {
      initialData &&
        deleteMember(initialData.id)
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
          <Input
            type="file"
            placeholder="Choose Book Cover"
            onChange={(e) => {
              setFile(e.target.files && e.target.files[0]);
            }}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Enter member email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Enter member password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Enter member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="post"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post/Designation</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Enter member post / designation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Enter member phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Enter member address" {...field} />
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
