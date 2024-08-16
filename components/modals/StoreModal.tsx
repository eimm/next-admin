"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";

import { withEnsureClient } from "@/components/HOCs/withEnsureClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/useStoreModal";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(1),
});

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const responce = await axios.post("/api/stores", values);
      toast.success(`Created new ${values.name} store`);
      window.location.assign(`/${responce.data.id}`);
    } catch (e) {
      toast.error("Submit was unsuccessful");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="A new store would be added with products"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Store"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex item-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default withEnsureClient(StoreModal);
