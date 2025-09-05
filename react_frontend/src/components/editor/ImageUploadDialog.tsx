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
  onOpenChange: (open: boolean) => void;
  /** Handler invoked with the selected file; should upload and insert into editor */
  onUpload: (file: File) => Promise<void>;
}

// PUBLIC_INTERFACE
export function ImageUploadDialog({ open, onOpenChange, onUpload }: ImageUploadDialogProps) {
  // reference props to satisfy no-unused-vars in all branches
  const _opened = open;
  void _opened;

  return (
    <Dialog
      open={open}
      onOpenChange={(v: boolean) => {
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <ImageUploader
          onUpload={async (file) => {
            await onUpload(file);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ImageUploadDialog;
