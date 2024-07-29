"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Variant } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/AlertModal";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type VariantFormSchema = z.infer<typeof formSchema>;

export default function VariantForm({
  initialData,
}: {
  initialData: Variant | null;
}) {
  const params = useParams<{ storeId: string; variantId: string }>();
  const router = useRouter();
  const form = useForm<VariantFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const title = initialData ? "Edit Variant" : "Create Variant";
  const description = initialData ? "Edit a Variant" : "Add a new Variant";
  const toastMessage = initialData ? "Updated" : "Created";
  const action = initialData ? "Save" : "Create";

  const onSubmit = async (data: VariantFormSchema) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/variants/${params.variantId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/variants`, data);
      }
      router.push(`/${params.storeId}/variants`);
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
      await axios.delete(`/api/${params.storeId}/variants/${params.variantId}`);
      router.push(`/${params.storeId}/variants`);
      router.refresh();
      toast.success("Deleted!");
    } catch (e) {
      toast.error("Make sure to delete all products of the variant first");
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
                  <FormLabel>Variant Name</FormLabel>
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
                  <FormLabel>Variant Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="value"
                      {...field}
                    />
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
