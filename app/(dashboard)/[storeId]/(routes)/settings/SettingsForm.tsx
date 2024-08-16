"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";

import { ApiAlert } from "@/components/ApiAlert";
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
import { useOrigin } from "@/hooks/useOrigin";

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormSchema = z.infer<typeof formSchema>;

export default function SettingsForm({ initialData }: { initialData: Store }) {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const origin = useOrigin();
  const form = useForm<SettingsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: SettingsFormSchema) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Saved!");
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      toast.success("Deleted!");
      router.push("/");
    } catch (e) {
      toast.error("Make sure to delete contents of the store first");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading title="Settings" description="Manage store settings" />
        <Button
          disabled={isLoading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            Save
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        description={`${origin}/api/${params.storeId}`}
        title="NEXT_PUBLIC_API_URL"
        variant="public"
      />
      <AlertModal
        isOpen={isOpen}
        loading={isLoading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
    </>
  );
}
