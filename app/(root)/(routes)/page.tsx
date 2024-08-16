"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/useStoreModal";

export default function EmptyPage() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  return <div>Hello</div>;
}
