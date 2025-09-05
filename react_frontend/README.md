# Realtime Blog Frontend

Bootstrapped with Vite, converted to React + TypeScript.

- Entry: src/main.tsx
- App shell: src/App.tsx
- Router: react-router-dom with placeholder routes
- HTML mount: index.html with <div id="root" />
- Auth: Clerk integration with `ClerkProvider`, `SignIn`, `SignUp`, `UserButton`
- Protected routes: simple `ProtectedRoute` guard

Env:
- Copy `.env.example` to `.env` and set `VITE_CLERK_PUBLISHABLE_KEY`

Routes:
- `/` — Home (public)
- `/dashboard` — Protected (requires sign in)
- `/sign-in` — Clerk Sign In
- `/sign-up` — Clerk Sign Up
- `/posts/:slug` — Public post viewer (placeholder)

Scripts:
- pnpm/npm/yarn dev — start dev server on port 3000
- pnpm/npm/yarn build — type-check and build
- pnpm/npm/yarn preview — preview production build
