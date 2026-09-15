# KLAD website

Next.js website for Klad Syndicate. Use pnpm; `pnpm-lock.yaml` is the dependency lockfile.

## Development

Use Node.js 22.13 or later and pnpm 11.24.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Staging

Deploy the `staging/audit-fixes` branch with these settings:

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build:staging`
- Start command, when required by the host: `pnpm start`
- Environment variable: `STAGING=1`

The staging build sends `X-Robots-Tag: noindex, nofollow` and includes matching page metadata. Use a separate preview deployment/domain; `main` remains the production branch. DataLane stays accessible by its direct URL and is intentionally absent from portfolio navigation and the sitemap.

To review the staging build locally:

```sh
pnpm build:staging
STAGING=1 pnpm start --hostname 127.0.0.1 --port 3100
```

## Checks

```sh
pnpm lint
pnpm build:staging
pnpm test:staging
```

The browser smoke check expects the local staging server at `http://127.0.0.1:3100`. Set `STAGING_URL` to check another preview. Install its Chromium browser once with `pnpm exec playwright install chromium`.

For Firefox or WebKit, install that browser with Playwright and run the same check with `STAGING_BROWSER=firefox` or `STAGING_BROWSER=webkit`. The check includes two complete homepage scroll cycles and a reload from the Team section.

Visual acceptance preserves the 10px desktop text, grain, blur treatment, intentional Team/menu overlap, monochrome portfolio covers, and scroll-driven portrait sequence. Video controls stay hidden during normal autoplay; reduced-motion mode keeps manual playback controls. Check the work title, Team section, mobile menu, and a case study at desktop, tablet, and mobile widths before merging.
