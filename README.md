# KLAD website

Next.js website for Klad Syndicate. Use pnpm; `pnpm-lock.yaml` is the dependency lockfile.

Local case-motion preview on port 3106: Work covers expand to fullscreen through React View Transitions, then reveal the case content. Close stays fixed until the footer's Previous / Close / Next controls enter view. Images, videos and text progressively sharpen from 6px blur to clear between 95% and 65% of the viewport height, capped at the page's scroll limit. Reduced motion keeps everything immediately clear; browsers without view-transition support navigate normally. Run `pnpm test:cases` to verify these behaviors in Chromium or WebKit. Embedded Vimeo playback is stubbed in this check.

Page imprints render images in grayscale while retaining their alpha and detail, except Work case covers, which become solid `#ABABAB` rectangles. The imprint layers supply 50%/30% opacity and 4px blur, with no extra opacity reduction. Team portrait frames load from the existing local AVIFs so their canvas can also be captured safely. Videos and unreadable external images retain their existing fallback.

The hero uses the original Figma vector (node `817:24844`) as `public/images/world.svg`, preserving its 1410 × 928 viewBox and the existing scroll trails. Reused country geometry and SVGO optimization reduced the export from 3,144,204 to 756,657 bytes (76% smaller; 232,351 bytes gzipped). The SVG contains no embedded raster images. Its download is larger than the baseline Next.js PNG delivery (170KB desktop / 38KB mobile), but remains sharp when enlarged.

Mobile navigation preserves the page snapshot even while the menu hides it from assistive technology. Imprint blur extends beyond the snapshot edges so it stays soft when scrolling upward through the About page's infinite loop.

## Development

Use Node.js 22.13 or later and pnpm 11.24.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Staging

Deploy all preview builds from the existing `staging` branch to [the stable Vercel staging preview](https://klad-web-git-staging-zmaznevegors-projects.vercel.app/).

Push changes to `origin/staging` to trigger the connected Vercel deployment. Verify that the deployment succeeds and use this stable branch URL for review. Deploy with these settings:

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build:staging`
- Start command, when required by the host: `pnpm start`
- Environment variable: `STAGING=1`

The staging build sends `X-Robots-Tag: noindex, nofollow` and includes matching page metadata. `main` remains the production branch. Datalane appears first in the portfolio and is listed in the sitemap.

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
pnpm test:responsive
pnpm test:work
pnpm test:imprints
```

The browser smoke check expects the local staging server at `http://127.0.0.1:3100`. Set `STAGING_URL` to check another preview. Install its Chromium browser once with `pnpm exec playwright install chromium`.

For Firefox or WebKit, install that browser with Playwright and run the same check with `STAGING_BROWSER=firefox` or `STAGING_BROWSER=webkit`. The check includes two complete homepage scroll cycles and a reload from the Team section.

Visual acceptance preserves the 10px desktop text, grain, blur treatment, intentional Team/menu overlap, monochrome portfolio covers, and scroll-driven portrait sequence. Video controls stay hidden during normal autoplay; reduced-motion mode keeps manual playback controls. Check the work title, Team section, mobile menu, and a case study at desktop, tablet, and mobile widths before merging.

`test:responsive` covers hybrid touch/mouse input, finite scrolling on touch-only devices, tablet headings, landscape portraits, short desktop windows, and video decoding fallback. It accepts the same `STAGING_URL` and `STAGING_BROWSER` settings.

`test:work` covers the Datalane default, returning to the selected project, rapid switching, short-window content, touch swipes and the case-page noise treatment. Swipe left or right on the Work cover to change projects; the first and last projects stop at the ends of the list. Project selection is kept in the URL so Close, browser Back and reload retain it. Case-study images and videos sit above the noise overlay; the background, text and surrounding spacing keep the original grain. Work and other pages retain their full noise overlay.

Cover swipes lock to their initial direction and require a deliberate horizontal movement before changing projects. Partial swipes do not open a case. The right navigation remains fixed in short desktop windows, with its own scrolling when its contents cannot fit.

On desktops without touch support, Up/Down arrows select the previous/next project. Wheel input over the Work content changes one project per deliberate gesture, with a movement threshold and an 800ms minimum interval. Wheel transitions use a 140ms fade out and a 220ms fade in with easing; reduced-motion mode switches immediately. In short windows, wheel input first scrolls the content; start a new gesture at the top or bottom to change projects. Direct `?case=` links render the selected project on the server, including when JavaScript is disabled.

Page imprints retain only the two previous viewports: the newest at 50% opacity and the older at 30%, both blurred by 4px. New imprints dissolve from clear ink over 800ms; reduced-motion mode shows the settled layers immediately. Work keeps the imprints faint, and individual case pages hide them. The two layers survive reloads within the same tab. `test:imprints` checks the layer limit, dissolve, case-page exclusion, SVG capture, homepage loops, history navigation, and storage fallback in Chromium or WebKit.

## Video assets

Videos load from the project folders on `https://klad.b-cdn.net/`, as mapped in `src/data/videos.json`. Desktop playback uses full-resolution files; phones and tablets use smaller H.264 Level 4.1 files. A decode or loading failure retries the smaller file automatically. Circus uses the same approved smaller files on all devices.

`public/videos` retains the prepared upload files. To regenerate them and `src/data/videos.json`, install FFmpeg and run `node scripts/prepare-videos.mjs`. The script caches source files in ignored `artifacts/video-sources`, repairs full-resolution metadata without re-encoding, and validates the generated files. Upload each project folder directly to Bunny storage: `public/videos/chainviz/1-hd.mp4` maps to `https://klad.b-cdn.net/chainviz/1-hd.mp4`. Purge affected URLs after replacing existing files.
