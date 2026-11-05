# Deploying CampusCart to Vercel

The project is configured to deploy as a Vite single-page application. The important settings are already stored in `vercel.json`:

- Build command: `pnpm build:static`
- Output directory: `dist/public`
- Framework: `vite`
- SPA rewrite: all routes are served through `index.html`

## Redeploy from the Vercel dashboard

Upload or connect the updated project, then use these settings if Vercel asks for them:

1. Framework preset: **Vite**
2. Build command: `pnpm build:static`
3. Output directory: `dist/public`
4. Install command: `pnpm install --frozen-lockfile`

After deployment, open the new deployment URL. The homepage should show the CampusCart storefront rather than JavaScript source code.

## Redeploy with the Vercel CLI

From the project root:

```bash
pnpm install --frozen-lockfile
pnpm build:static
npx vercel --prod
```

No server or database environment variables are required for the public storefront demo. The original Express server files remain in the project for future backend work, but the Vercel deployment now serves the frontend build directly.
