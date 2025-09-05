/**
 * Optional dialog component that can be used to present upload UI.
 * Not currently wired to routes by default, but can be composed into editors.
 */
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ImageUploader from "../uploader/ImageUploader";

export interface ImageUploadDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Notifier to toggle dialog open state */
  onOpenChange: (value: boolean) => void;
  /** Handler invoked with the selected file; should upload and insert into editor */
  onUpload: (file: File) => Promise<void>;
}

// PUBLIC_INTERFACE
export function ImageUploadDialog({ open, onOpenChange, onUpload }: ImageUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <ImageUploader
          onUpload={async (file: File) => {
            await onUpload(file);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ImageUploadDialog;
