"use client";

import { useState } from "react";
import { Store } from "@prisma/client";
import {
  ArchiveIcon,
  CaretDownIcon,
  CheckIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";

import { useStoreModal } from "@/hooks/useStoreModal";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent,PopoverTrigger } from "./ui/popover";

type PopoverTriggerProps = React.ComponentProps<typeof PopoverTrigger>;

interface ComponentProps extends PopoverTriggerProps {
  items: Store[];
}

interface DisplayStore {
  value: string;
  label: string;
}

export default function StoresSelect({
  className,
  items = [],
}: ComponentProps) {
  const storeModal = useStoreModal();
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const displayItems: DisplayStore[] = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const current = displayItems.find((item) => item.value === params.storeId);

  const onChange = (store: DisplayStore) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };
  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={isOpen}
          aria-label="Select Store"
          className={cn("w-[200px] justify-between", className)}
          disabled={isOpen}
        >
          <ArchiveIcon className="mr-2 h-4 w-4" />
          {current && current.label}
          <CaretDownIcon className={cn(isOpen && "opacity-0")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search" />
            <CommandEmpty>Not found</CommandEmpty>
            <CommandGroup heading="Stores">
              {displayItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onChange(item)}
                  className="text-sm"
                >
                  <ArchiveIcon className="mr-2 h-4 w-4" />
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      current?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                key="test"
                value="test"
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusIcon className="mr-2 h5 w-5" />
                New Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
