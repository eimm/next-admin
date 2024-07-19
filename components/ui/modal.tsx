"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  onClose,
  isOpen,
  title,
  description,
  children,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <>{children}</>
      </DialogContent>
    </Dialog>
  );
};
