"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Store } from "@prisma/client";

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

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormSchema = z.infer<typeof formSchema>;

export default function SettingsForm({ initialData }: { initialData: Store }) {
  const form = useForm<SettingsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isOpen, setOpen] = useState(false);
  const [isLoading, SetLoading] = useState(false);

  const onSubmit = async (data: SettingsFormSchema) => {
    console.log(data);
  };
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading title="Settings" description="Manage store settings" />
        <Button variant="destructive" size="icon" onClick={() => {}}>
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
    </>
  );
}
