<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Staging previews

All preview builds must use the existing `staging` branch and deploy to:
https://klad-web-git-staging-zmaznevegors-projects.vercel.app/

Push preview changes to `origin/staging` through the connected Vercel Git integration. Verify that the Vercel deployment succeeds and share this stable branch URL for review. Use `STAGING=1` and `pnpm build:staging` for staging builds. `main` is the production branch.
