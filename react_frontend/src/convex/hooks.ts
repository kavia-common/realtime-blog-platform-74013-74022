import { useMutation as useConvexMutation, useQuery as useConvexQuery } from "./react-stub";
import { mutations, queries } from "./schema";

/**
 * PUBLIC_INTERFACE
 * usePostsListByUser
 * Returns a real-time list of posts for the current user (by clerkId or backend-chosen key).
 * Passing undefined should result in the query returning the current user's posts once backend is implemented.
 */
export function usePostsListByUser(userId?: string) {
  return useConvexQuery(queries.listPostsByUser as any, userId ? { userId } : undefined) as
    | Array<{
        _id: string;
        title: string;
        slug: string;
        published: boolean;
        updatedAt?: string;
      }>
    | undefined;
}

/**
 * PUBLIC_INTERFACE
 * usePostById
 * Subscribes to a single post document by id.
 */
export function usePostById(postId?: string) {
  return useConvexQuery(queries.getPostById as any, postId ? { postId } : undefined) as
    | {
        _id: string;
        title: string;
        slug?: string;
        content?: string;
        published?: boolean;
        updatedAt?: string;
      }
    | undefined;
}

/**
 * PUBLIC_INTERFACE
 * usePostMutations
 * Returns bound mutation functions for CRUD operations.
 * These will be wired to actual Convex endpoints once backend is implemented.
 */
export function usePostMutations() {
  type CreatePostFn = (input: {
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    tags?: string[];
  }) => Promise<{ postId: string } | void>;
  type UpdatePostFn = (input: {
    postId: string;
    title?: string;
    slug?: string;
    content?: string;
    coverImage?: string | null;
    tags?: string[];
  }) => Promise<void>;
  type SimplePostIdFn = (input: { postId: string }) => Promise<void>;

  const createPost = useConvexMutation(mutations.createPost as any) as unknown as CreatePostFn;
  const updatePost = useConvexMutation(mutations.updatePost as any) as unknown as UpdatePostFn;
  const publishPost = useConvexMutation(mutations.publishPost as any) as unknown as SimplePostIdFn;
  const unpublishPost = useConvexMutation(mutations.unpublishPost as any) as unknown as SimplePostIdFn;
  const deletePost = useConvexMutation(mutations.deletePost as any) as unknown as SimplePostIdFn;

  return { createPost, updatePost, publishPost, unpublishPost, deletePost };
}
