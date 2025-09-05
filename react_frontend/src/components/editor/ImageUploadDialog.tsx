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
  onOpenChange: ((open: boolean) => void);
  /** Handler invoked with the selected file; should upload and insert into editor */
  onUpload: ((file: File) => Promise<void>);
}

// PUBLIC_INTERFACE
export function ImageUploadDialog(props: ImageUploadDialogProps) {
  const { onOpenChange, onUpload } = props;

  return (
    <Dialog
      open={props.open}
      onOpenChange={(v: boolean) => {
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <ImageUploader
          onUpload={async (_file) => {
            // Use underscore param to indicate intentional usage scope
            await onUpload(_file);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ImageUploadDialog;
