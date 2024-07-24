"use client";

import React, { ComponentType, FC } from "react";
import { withEnsureClient } from "@/components/HOCs/withEnsureClient";
import { Modal } from "@/components/ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps extends React.JSX.IntrinsicAttributes {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      title="Are you sure?"
      description="You are going to delete store data"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default withEnsureClient(AlertModal);
