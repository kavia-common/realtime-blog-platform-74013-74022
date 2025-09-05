# Realtime Blog Frontend

Bootstrapped with Vite, converted to React + TypeScript.

- Entry: src/main.tsx
- App shell: src/App.tsx
- Router: react-router-dom with placeholder routes
- HTML mount: index.html with <div id="root" />
- Auth: Clerk integration with `ClerkProvider`, `SignIn`, `SignUp`, `UserButton`
- Protected routes: simple `ProtectedRoute` guard
- Data: Convex client scaffold in `src/convex` with provider `src/providers/ConvexProvider.tsx`
- Editor: TipTap-based rich text editor in `src/components/editor` with image uploads via `src/lib/upload.ts`

## Environment Setup

This app is configured via Vite environment variables. Only keys prefixed with `VITE_` are available in the browser. Do not place server-only secrets here.

1) Copy the example file and fill in values:
- cp .env.example .env

2) Required environment variables:
- VITE_CLERK_PUBLISHABLE_KEY
  - What: Clerk publishable key for your application.
  - Where to obtain: Clerk Dashboard → Your application → API Keys → Publishable key.
  - Example: pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
  - Used in: src/auth/clerk.tsx (ClerkProvider configuration)
- VITE_CONVEX_URL
  - What: Public origin URL of your Convex deployment.
  - Where to obtain: After deploying Convex; it typically looks like https://your-deployment.convex.cloud. This also corresponds to the "origin" field in convex.json for local configuration.
  - Example: https://your-deployment.convex.cloud
  - Used in: src/convex/client.ts (ConvexReactClient initialization), src/lib/upload.ts (as a base for upload endpoints)
- VITE_PUBLIC_BASE_URL (optional but recommended)
  - What: The public origin of your frontend app, used to generate absolute links when needed (for example copyable public post URLs).
  - Example (dev): http://localhost:3000
  - Example (prod): https://blog.example.com
  - Used in: link generation and SEO where absolute URLs are beneficial.
- Upload-related variables (optional until you wire a backend for uploads)
  - Current code falls back to temporary object URLs. When enabling real uploads (Convex storage or UploadThing), add client-safe keys here (only publishable keys).
  - Examples:
    - VITE_UPLOADTHING_APP_ID=XXXXXXXX
    - VITE_UPLOADTHING_PUBLIC_API_KEY=XXXXXXXX
    - VITE_UPLOAD_BACKEND=convex
    - VITE_UPLOAD_MAX_SIZE_MB=10

Security notes:
- Never store server-only secrets in `.env` with a `VITE_` prefix since those are exposed to the browser.
- Backend secrets should live in your Convex functions configuration or server-side environment.

## How to Run

- Install dependencies:
  - npm install
- Start development server (port 3000):
  - npm run dev
- Type-check and build:
  - npm run build
- Preview production build:
  - npm run preview

When running in development:
- Ensure `.env` contains VITE_CLERK_PUBLISHABLE_KEY and VITE_CONVEX_URL at minimum.
- The app will warn in the console if values are missing.

## Production Build & Deployment

### 1) Build the app with Vite
- Ensure .env is configured for the target environment (production values).
- Recommended: create a separate .env.production file for your CI/CD to inject.
- Commands:
  - npm ci
  - npm run build
- Output: the optimized static site is generated under dist/

Useful docs:
- Vite build guide: https://vitejs.dev/guide/build.html

### 2) Host the static site
You can deploy the dist/ folder to any static hosting platform (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, Firebase Hosting, etc.). Make sure you:
- Configure SPA fallback so client-side routes resolve to index.html
- Set the correct environment variables for the build at deploy time (VITE_* variables)
- Set VITE_PUBLIC_BASE_URL to your public domain (e.g., https://blog.example.com)

Platform docs:
- Vercel: https://vercel.com/docs/deployments/overview
- Netlify: https://docs.netlify.com/site-deploys/create-deploys/
- Cloudflare Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/
- AWS S3 + CloudFront: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

### 3) Connect to Convex production
- Deploy your Convex backend and obtain the production deployment URL (origin), which looks like https://<your-deployment>.convex.cloud
- Update .env for production:
  - VITE_CONVEX_URL=https://<your-deployment>.convex.cloud
- Ensure the functions your frontend expects are implemented on the backend:
  - Queries: posts:listPostsByUser, posts:getPostById, posts:getPostBySlugPublic
  - Mutations: posts:createPost, posts:updatePost, posts:publishPost, posts:unpublishPost, posts:deletePost, users:upsertUser

Convex docs:
- Getting started: https://docs.convex.dev/
- Deploying: https://docs.convex.dev/production/deploy
- Convex React client: https://docs.convex.dev/javascript/using-convex-react

### 4) Configure Clerk for production authentication
Clerk must be configured to allow your production domain(s) and provide a publishable key for production.

Steps:
- In Clerk Dashboard, create/set your production instance or environment.
- Add your app’s domain(s) to Allowed Origins/Redirect URLs (e.g., https://blog.example.com).
- Obtain the Publishable Key for production and set it as:
  - VITE_CLERK_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
- Ensure the frontend routes used by Clerk are available:
  - /sign-in and /sign-up (already defined in routes)
- If you host on a different domain than your API or Convex, ensure CORS and redirect URL settings are correct.

Clerk docs:
- Getting started: https://clerk.com/docs
- Allowed origins & redirect URLs: https://clerk.com/docs/security/allowlist
- Publishable key: https://clerk.com/docs/reference/javascript/publishable-key

### 5) Configure image storage (UploadThing or Convex)
By default, this project falls back to temporary object URLs for local previews. To enable persistent uploads:

Option A — Convex Storage or HTTP endpoint
- Implement an HTTP endpoint in your Convex backend to accept file uploads and return a public URL.
- Update `src/lib/upload.ts` -> implement `tryUploadViaConvex` to POST the file to your endpoint and return the public URL.
- Environment variables:
  - VITE_CONVEX_URL (already required)
  - Optionally add switches like VITE_UPLOAD_BACKEND=convex and size limits like VITE_UPLOAD_MAX_SIZE_MB
- Docs:
  - Convex HTTP routes: https://docs.convex.dev/http
  - Convex file storage (if using storage APIs): https://docs.convex.dev/storage

Option B — UploadThing
- Create an UploadThing project and route handlers on your backend (server-side).
- On the client, use only publishable identifiers/keys.
- Example environment variables (client-safe):
  - VITE_UPLOADTHING_APP_ID=your_app_id
  - VITE_UPLOADTHING_PUBLIC_API_KEY=public_key
- Update `src/lib/upload.ts` to call your UploadThing endpoint and inject the returned URL into the editor.
- Docs:
  - UploadThing docs: https://docs.uploadthing.com/
  - React usage: https://docs.uploadthing.com/getting-started/appdir#react

Security note:
- Do not place server secrets in frontend env (VITE_*) as they are exposed to the browser. Keep secrets on the server/Convex side.

### 6) Domain & SEO configuration
- Set VITE_PUBLIC_BASE_URL to your production domain. This helps ensure generated share links and canonical URLs are correct.
- Configure your hosting platform to serve over HTTPS and set up your custom domain with the provider’s DNS instructions.

## Convex

- Config placeholder in `convex.json`
- Frontend client: `src/convex/client.ts`
- Frontend schema/types: `src/convex/schema.ts`
- Provider: `src/providers/ConvexProvider.tsx` (wraps app in `AppConvexProvider` and syncs Clerk user via `users:upsertUser`)
- Base function names expected on backend:
  - Queries: `posts:listPostsByUser`, `posts:getPostById`, `posts:getPostBySlugPublic`
  - Mutations: `posts:createPost`, `posts:updatePost`, `posts:publishPost`, `posts:unpublishPost`, `posts:deletePost`, `users:upsertUser`

## Image uploads

- The app uses an abstracted upload util at `src/lib/upload.ts`.
- Currently, it falls back to temporary object URLs for local preview.
- To enable production uploads, implement either:
  - A Convex HTTP endpoint (recommended for full-stack control) exposed from your Convex backend that accepts file uploads and returns a public URL, or
  - UploadThing or another storage provider that returns a public URL.
- Once implemented, modify `tryUploadViaConvex` in `src/lib/upload.ts` (or create a new branch based on VITE_UPLOAD_BACKEND) to POST the file to your endpoint and return the URL.

## Routes

- `/` — Home (public)
- `/dashboard` — Protected (requires sign in)
- `/sign-in` — Clerk Sign In
- `/sign-up` — Clerk Sign Up
- `/p/:slug` — Public post viewer (SEO-friendly by slug; uses react-helmet-async for meta tags)

## Scripts

- pnpm/npm/yarn dev — start dev server on port 3000
- pnpm/npm/yarn build — type-check and build
- pnpm/npm/yarn preview — preview production build
