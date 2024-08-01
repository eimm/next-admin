import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  CaretDownIcon,
  ClipboardCopyIcon,
  MagicWandIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/AlertModal";

import { ProductColumn } from "./Columns";

interface CellactionProps {
  product: ProductColumn;
}

export const CellAction: FC<CellactionProps> = ({ product }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const copy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id copied");
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${product.id}`);
      router.refresh();
      toast.success("Deleted!");
    } catch (e) {
      toast.error("Make sure to delete contents of the product first");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <CaretDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${product.id}`)
            }
          >
            <MagicWandIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copy(product.id)}>
            <ClipboardCopyIcon className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertModal
        isOpen={isOpen}
        loading={isLoading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
    </>
  );
};
