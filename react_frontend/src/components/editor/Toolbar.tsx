import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown";

function MenuButton({
  active,
  onClick,
  children,
  title,
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="h-8 px-2"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

// PUBLIC_INTERFACE
export interface ToolbarProps {
  editor: Editor;
  onAddImageByUrl: () => void;
  onUploadImage: () => void;
}

/** PUBLIC_INTERFACE
 * Toolbar
 * Minimal Notion-like toolbar controls for the TipTap editor instance.
 */
export function Toolbar({ editor, onAddImageByUrl, onUploadImage }: ToolbarProps) {
  if (!editor) return null;

  const canUndo = editor.can().chain().focus().undo().run();
  const canRedo = editor.can().chain().focus().redo().run();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 px-2 py-1.5" role="toolbar" aria-label="Editor toolbar">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 px-2" aria-haspopup="menu" aria-label="Headings menu">H</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Heading levels">
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MenuButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-pressed={editor.isActive("bold")}
        aria-label="Toggle bold"
      >
        B
      </MenuButton>
      <MenuButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-pressed={editor.isActive("italic")}
        aria-label="Toggle italic"
      >
        I
      </MenuButton>
      <MenuButton
        title="Strike"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        aria-pressed={editor.isActive("strike")}
        aria-label="Toggle strikethrough"
      >
        S
      </MenuButton>
      <MenuButton
        title="Code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-pressed={editor.isActive("code")}
        aria-label="Toggle inline code"
      >
        {"</>"}
      </MenuButton>
      <MenuButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-pressed={editor.isActive("blockquote")}
        aria-label="Toggle blockquote"
      >
        ❝
      </MenuButton>

      <MenuButton
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-pressed={editor.isActive("bulletList")}
        aria-label="Toggle bullet list"
      >
        ••
      </MenuButton>
      <MenuButton
        title="Ordered List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-pressed={editor.isActive("orderedList")}
        aria-label="Toggle ordered list"
      >
        1.
      </MenuButton>
      {/* Task list support can be enabled by adding @tiptap/extension-task-list & task-item later */}
      {/* Placeholder button removed to avoid runtime/typing issues */}

      <MenuButton
        title="Code Block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-pressed={editor.isActive("codeBlock")}
        aria-label="Toggle code block"
      >
        {"{ }"}
      </MenuButton>

      <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

      <MenuButton title="Link" aria-label="Insert or edit link" active={editor.isActive("link")} onClick={() => {
        const previous = editor.getAttributes("link")["href"] as string | undefined;
        const url = window.prompt("URL", previous || "https://");
        if (url === null) return;
        if (url === "") {
          editor.chain().focus().unsetLink().run();
          return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }}>
        🔗
      </MenuButton>
      <MenuButton title="Remove Link" aria-label="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
        🚫🔗
      </MenuButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 px-2" aria-haspopup="menu" aria-label="Image actions">Image</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Image actions menu">
          <DropdownMenuItem onClick={onAddImageByUrl}>Insert by URL</DropdownMenuItem>
          <DropdownMenuItem onClick={onUploadImage}>Upload…</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mx-1 h-5 w-px bg-border" />

      <MenuButton title="Undo" aria-label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!canUndo}>
        ↶
      </MenuButton>
      <MenuButton title="Redo" aria-label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!canRedo}>
        ↷
      </MenuButton>
      <MenuButton title="Clear Marks" aria-label="Clear all marks" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        Clear Marks
      </MenuButton>
      <MenuButton title="Clear Nodes" aria-label="Clear all nodes" onClick={() => editor.chain().focus().clearNodes().run()}>
        Clear Nodes
      </MenuButton>
    </div>
  );
}
