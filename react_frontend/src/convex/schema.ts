/**
 * Frontend schema definitions and typed outlines for Convex data models.
 * This file mirrors the intended Convex schema for types and app usage.
 *
 * Note: The actual Convex backend implementation will define these tables
 * and functions. Here we provide TypeScript types and function name constants
 * to be used with the Convex client in the frontend.
 */

/**
 * PUBLIC_INTERFACE
 * User model
 */
export interface User {
  _id: string;             // Convex document id (as string in frontend)
  clerkId: string;         // Clerk user id
  username: string;        // Chosen username
  avatarUrl?: string;      // Optional avatar URL
  createdAt: string;       // ISO string timestamp
  updatedAt: string;       // ISO string timestamp
}

/**
 * PUBLIC_INTERFACE
 * Post model
 */
export interface Post {
  _id: string;              // Convex document id
  authorId: string;         // User _id or clerkId depending on backend mapping
  title: string;
  slug: string;             // SEO-friendly unique slug for published access
  content: string;          // Rich text/JSON serialized content (TipTap/ProseMirror)
  coverImage?: string;      // Optional image URL or storage id
  published: boolean;
  tags: string[];           // Array of tags
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
}

/**
 * PUBLIC_INTERFACE
 * Query function names to be used via convexReact.useQuery
 * These string constants must match backend function names once implemented.
 */
export const queries = {
  listPostsByUser: "posts:listPostsByUser",
  getPostById: "posts:getPostById",
  getPostBySlugPublic: "posts:getPostBySlugPublic",
} as const;

/**
 * PUBLIC_INTERFACE
 * Mutation function names to be used via convexReact.useMutation
 */
export const mutations = {
  createPost: "posts:createPost",
  updatePost: "posts:updatePost",
  publishPost: "posts:publishPost",
  unpublishPost: "posts:unpublishPost",
  deletePost: "posts:deletePost",
  upsertUser: "users:upsertUser",
} as const;

/**
 * PUBLIC_INTERFACE
 * Helper interfaces for function arguments (synchronized with backend later)
 */
export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  tags?: string[];
}

export interface UpdatePostInput {
  postId: string;
  title?: string;
  slug?: string;
  content?: string;
  coverImage?: string | null;
  tags?: string[];
}

export interface ListPostsByUserInput {
  userId: string; // backend may expect authorId or clerkId; align on backend
}

export interface GetPostByIdInput {
  postId: string;
}

export interface GetPostBySlugPublicInput {
  slug: string;
}

export interface UpsertUserInput {
  clerkId: string;
  username: string;
  avatarUrl?: string;
}
