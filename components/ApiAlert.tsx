"use client";

import React, { FC } from "react";
import { CardStackIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge, BadgeProps } from "./ui/badge";
import { Button } from "./ui/button";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: FC<ApiAlertProps> = ({
  description,
  title,
  variant,
}) => {
  const copy = () => {
    navigator.clipboard.writeText(description);
  };
  return (
    <Alert>
      <CardStackIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-light">
          {description}
        </code>
        <Button variant="ghost" size="icon" onClick={copy}>
          <ClipboardCopyIcon className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
