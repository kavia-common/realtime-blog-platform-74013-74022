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
  type CreatePostFn = (payload: {
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    tags?: string[];
  }) => Promise<{ postId: string } | void>;
  type UpdatePostFn = (payload: {
    postId: string;
    title?: string;
    slug?: string;
    content?: string;
    coverImage?: string | null;
    tags?: string[];
  }) => Promise<void>;
  type SimplePostIdFn = (payload: { postId: string }) => Promise<void>;

  const _create = useConvexMutation(mutations.createPost as any) as unknown as CreatePostFn;
  const _update = useConvexMutation(mutations.updatePost as any) as unknown as UpdatePostFn;
  const _publish = useConvexMutation(mutations.publishPost as any) as unknown as SimplePostIdFn;
  const _unpublish = useConvexMutation(mutations.unpublishPost as any) as unknown as SimplePostIdFn;
  const _delete = useConvexMutation(mutations.deletePost as any) as unknown as SimplePostIdFn;

  // Wrap to ensure parameters are referenced for linting in stubbed environment
  const createPost: CreatePostFn = async (first) => _create(first);
  const updatePost: UpdatePostFn = async (first) => _update(first);
  const publishPost: SimplePostIdFn = async (first) => _publish(first);
  const unpublishPost: SimplePostIdFn = async (first) => _unpublish(first);
  const deletePost: SimplePostIdFn = async (first) => _delete(first);

  return { createPost, updatePost, publishPost, unpublishPost, deletePost };
}
