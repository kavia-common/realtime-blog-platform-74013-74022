import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ImageUploader from "../uploader/ImageUploader";
import { uploadImage } from "../../lib/upload";
import { useMutation } from "../../convex/react-stub";
import { mutations } from "../../convex/schema";

/**
 * PUBLIC_INTERFACE
 * ProfileFormProps
 * Props for ProfileForm component.
 */
export interface ProfileFormProps {
  /** Optional className for layout container */
  className?: string;
  /** Callback when profile update succeeds */
  onUpdated?: { (payload?: any): void };
}

/**
 * PUBLIC_INTERFACE
 * ProfileForm
 * A minimal profile editor that allows updating username and overriding avatar.
 * It shows Clerk's current values as defaults but stores an override avatar URL
 * in Convex. Uses framer-motion for subtle transitions.
 */
export function ProfileForm({ className, onUpdated }: ProfileFormProps) {
  const { user } = useUser();
  const upsertUser = useMutation(mutations.upsertUser);

  const initialUsername = useMemo(() => {
    return (
      user?.username ??
      user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
      (user ? `user-${user.id.slice(-6)}` : "")
    );
  }, [user]);
  const initialAvatar = user?.imageUrl ?? "";

  const [username, setUsername] = useState<string>(initialUsername || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatar);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onUploadAvatar = useCallback(
    async (file: File) => {
      setBusy(true);
      setMessage(null);
      setError(null);
      try {
        const url = await uploadImage(file);
        setAvatarUrl(url);
        setMessage("Avatar selected. Remember to Save.");
      } catch (e) {
        console.warn("Avatar upload failed:", e);
        setError("Avatar upload failed.");
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const onSave = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      await upsertUser({
        clerkId: user.id,
        username: username.trim() || initialUsername || `user-${user.id.slice(-6)}`,
        avatarUrl: avatarUrl || undefined,
      });
      setMessage("Profile saved.");
      const payload = { username: username.trim() || initialUsername || "", avatarUrl: avatarUrl || undefined };
      onUpdated?.(payload);
    } catch (e) {
      console.warn("Profile save failed (upsertUser):", e);
      setError("Save failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [avatarUrl, initialUsername, upsertUser, user, username, onUpdated]);

  const containerVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="space-y-6">
        <div className="grid gap-2">
          <label htmlFor="username" className="text-sm text-muted-foreground">
            Username
          </label>
          <Input
            id="username"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={busy}
          />
          <div className="text-xs text-muted-foreground">
            This name will appear on your posts.
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Avatar</div>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="h-10 w-10 rounded-full border object-cover"
              />
            ) : null}
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="https://example.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              disabled={busy}
            />
            <div className="text-xs text-muted-foreground">
              Provide a direct image URL or upload below to override your Clerk avatar.
            </div>
            <ImageUploader
              onUpload={onUploadAvatar}
              label="Drag & drop avatar, or click to upload"
              accept="image/*"
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onSave} disabled={busy || !user}>
            {busy ? "Saving…" : "Save"}
          </Button>
          {user ? null : (
            <span className="text-xs text-muted-foreground">
              Sign in to edit your profile.
            </span>
          )}
        </div>

        {message ? (
          <motion.div
            className="text-xs text-green-600"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {message}
          </motion.div>
        ) : null}
        {error ? (
          <motion.div
            className="text-xs text-red-600"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {error}
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default ProfileForm;
