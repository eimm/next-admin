"use client";

import React, { FC, useRef } from "react";
import { TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { withEnsureClient } from "./HOCs/withEnsureClient";
import { Button } from "./ui/button";

interface ImageUploadProps extends JSX.IntrinsicAttributes {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const images = useRef<string[]>(value);
  const addImage = (url: string) => {
    images.current.push(url);
    return images.current;
  };
  const onUpload = (result: any) => {
    onChange(addImage(result.info.secure_url));
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-sm overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="uploadPreset1">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="outline"
              onClick={onClick}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default withEnsureClient(ImageUpload);
