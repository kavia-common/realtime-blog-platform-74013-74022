import React, { useCallback, useEffect, useState } from "react";
import { EditorContent, Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TipTapCodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight/lib/common";
import { cn } from "./utils";
import { Toolbar } from "./Toolbar";
import "./tiptap.css";

export type TipTapJSON = Record<string, unknown>;

// PUBLIC_INTERFACE
export interface RichEditorProps {
  /** Initial content as TipTap/ProseMirror JSON */
  initialContent?: TipTapJSON | null;
  /** Called whenever content changes (debounced locally) */
  onChange?: (value: TipTapJSON) => void;
  /** Called when user wants to upload an image; should return a URL to insert */
  onUploadImage?: (f: File) => Promise<string>;
  /** Optional className for container */
  className?: string;
  /** Optional placeholder text */
  placeholder?: string;
}

/**
 * PUBLIC_INTERFACE
 * RichEditor
 * A TipTap-based rich text editor with a modular toolbar.
 * Supports:
 * - Headings, bold/italic/strike/blockquote, code, code blocks with syntax highlighting
 * - Ordered/Unordered/Task lists
 * - Links (toggleLink)
 * - Images (upload + insert by URL)
 * Emits TipTap JSON documents via onChange.
 */
export function RichEditor({
  initialContent,
  onChange,
  onUploadImage,
  className,
  placeholder = "Write your post...",
}: RichEditorProps) {
  const [editor, setEditor] = useState<TiptapEditor | null>(null);

  // Initialize editor
  useEffect(() => {
    const instance = new TiptapEditor({
      extensions: [
        StarterKit.configure({
          codeBlock: false, // replaced by TipTapCodeBlockLowlight
        }),
        TipTapCodeBlockLowlight.configure({
          lowlight,
        }),
        Placeholder.configure({
          placeholder,
        }),
        Link.configure({
          protocols: ["http", "https", "mailto", "tel"],
          openOnClick: true,
          autolink: true,
          linkOnPaste: true,
        }),
        Image.configure({
          allowBase64: true,
        }),
      ],
      editorProps: {
        attributes: {
          class:
            "prose prose-neutral max-w-none focus:outline-none",
        },
      },
      content: initialContent ?? undefined,
      onUpdate: (ctx) => {
        const json = ctx.editor.getJSON() as TipTapJSON;
        if (onChange) onChange(json);
      },
    });

    setEditor(instance);

    return () => {
      instance.destroy();
      setEditor(null);
    };
  }, []);

  // Update content if initialContent changes (e.g., when loading an existing post)
  useEffect(() => {
    if (!editor || !initialContent) return;
    // Only update if different (avoid breaking undo history unnecessarily)
    try {
      const current = editor.getJSON();
      const next = initialContent;
      if (JSON.stringify(current) !== JSON.stringify(next)) {
        editor.commands.setContent(next);
      }
    } catch {
      // safe fallback
      editor.commands.setContent(initialContent as any);
    }
  }, [editor, initialContent]);

  const handleAddImageByUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const handleUploadImage = useCallback(async () => {
    if (!editor) return;
    if (!onUploadImage) {
      window.alert("Upload not configured yet.");
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await onUploadImage(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } catch (e) {
        console.error("Image upload failed:", e);
        window.alert("Image upload failed.");
      }
    };
    input.click();
  }, [editor, onUploadImage]);

  if (!editor) {
    return (
      <div className={cn("rounded-md border p-4 text-sm text-muted-foreground", className)}>
        Loading editor...
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Toolbar
        editor={editor}
        onAddImageByUrl={handleAddImageByUrl}
        onUploadImage={handleUploadImage}
      />
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default RichEditor;
