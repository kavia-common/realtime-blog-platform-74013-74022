 /** 
  * Simple image uploader UI that accepts a file and calls onUpload.
  * Includes drag-and-drop and click-to-select.
  */
import React, { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";

export interface ImageUploaderProps {
  // PUBLIC_INTERFACE
  onUpload: { (file: File): Promise<void> };
  className?: string;
  accept?: string;
  label?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// PUBLIC_INTERFACE
export function ImageUploader({
  onUpload,
  className,
  accept = "image/*",
  label = "Drag & drop an image here, or click to upload",
}: ImageUploaderProps) {

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !files.length) return;
      const file = files[0];
      setBusy(true);
      try {
        await onUpload(file);
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onUpload]
  );

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      await handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div
      className={cn(
        "rounded-md border border-dashed p-4 text-center transition-colors",
        dragOver ? "bg-muted/50" : "bg-transparent",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
      }}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      onClick={onClick}
      aria-busy={busy}
      aria-label="Image uploader. Press Enter to choose a file or drop an image here."
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
        }}
        aria-hidden="true"
      />
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Button type="button" variant="secondary" size="sm" disabled={busy}>
          {busy ? "Uploading..." : "Choose File"}
        </Button>
      </div>
    </div>
  );
}

export default ImageUploader;
