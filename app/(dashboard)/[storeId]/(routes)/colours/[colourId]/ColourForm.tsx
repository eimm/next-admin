"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colour } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";

import AlertModal from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/, {
      message: "String must be a hex colour code",
    }),
});

type ColourFormSchema = z.infer<typeof formSchema>;

export default function ColourForm({
  initialData,
}: {
  initialData: Colour | null;
}) {
  const params = useParams<{ storeId: string; colourId: string }>();
  const router = useRouter();
  const form = useForm<ColourFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const title = initialData ? "Edit Colour" : "Create Colour";
  const description = initialData ? "Edit a Colour" : "Add a new Colour";
  const toastMessage = initialData ? "Updated" : "Created";
  const action = initialData ? "Save" : "Create";

  const onSubmit = async (data: ColourFormSchema) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colours/${params.colourId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colours`, data);
      }
      router.push(`/${params.storeId}/colours`);
      router.refresh();
      toast.success(toastMessage);
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colours/${params.colourId}`);
      router.push(`/${params.storeId}/colours`);
      router.refresh();
      toast.success("Deleted!");
    } catch (e) {
      toast.error("Make sure to delete all products of the colour first");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colour Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colour Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-2">
                      <Input
                        disabled={isLoading}
                        placeholder="value"
                        {...field}
                      />
                      <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <AlertModal
        isOpen={isOpen}
        loading={isLoading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
    </>
  );
}
