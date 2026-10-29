# KLAD website

Next.js website for Klad Syndicate. Use pnpm; `pnpm-lock.yaml` is the dependency lockfile.

Local case-motion preview uses the shared staging server on port 3100: cases use normal route navigation and a staggered entrance inspired by https://www.michael.fm/kanon: visible content fades from 8px blur and a 24px downward offset over 1.1 seconds, with 100ms between groups. Close aligns with Previous/Next and uses the logo/cursor's content inversion without a background or padding. On desktop it remains fixed until the footer's Previous / Close / Next controls enter view; on mobile it scrolls away with the header. Images, videos and text progressively sharpen from 6px blur to clear between 95% and 65% of the viewport height, capped at the page's scroll limit. Reduced motion keeps everything immediately clear. Run `pnpm test:cases` to verify these behaviors in Chromium, Firefox or WebKit.

Page imprints render images in grayscale while retaining their alpha and detail, except Work case covers, which become solid `#ABABAB` rectangles. Individual case studies neither display nor create imprints; Close, case switching and browser history preserve the existing eligible layers. Work still creates imprints. The imprint layers supply 50%/30% opacity and 4px blur, with no extra opacity reduction. Team portrait frames load from the existing local AVIFs so their canvas can also be captured safely. Videos and unreadable external images retain their existing fallback.

The shared Cursor Ghost preset adds seven 26px arrow copies with 0.28 follow and up to 5px blur. The trail and header logo use the same `#E6E6E6` source artwork and invert the content beneath them with difference blending, including photographs, instead of switching source colors with the page theme. The native cursor stays visible, and the trail disappears at rest, on window exit, and during keyboard navigation. Touch and reduced-motion users keep the native behavior. Run `node scripts/check-cursor.mjs` against the staging server (with `STAGING_BROWSER=webkit` for Safari coverage).

The production header logo follows homepage scroll, plays one cycle every 12 seconds on other pages, and stays still in the mobile menu and with reduced motion. Animated ink is calibrated directly to `#E7E7E7` / `#000000` before difference blending, preserving the brand colors without an outer SVG color filter. `pnpm test:logo` checks its desktop and touch behavior, content inversion, clipping, stacking, navigation and playback fallbacks. `node scripts/check-logo-motion.mjs` checks the standalone SVG artwork and reference frames in Chromium and WebKit.

The hero uses the original Figma vector (node `817:24844`) as `public/images/world.svg`, preserving its 1410 × 928 viewBox and the existing scroll trails. Reused country geometry and SVGO optimization reduced the export from 3,144,204 to 756,657 bytes (76% smaller; 232,351 bytes gzipped). The SVG contains no embedded raster images. Its download is larger than the baseline Next.js PNG delivery (170KB desktop / 38KB mobile), but remains sharp when enlarged.

Mobile navigation preserves the page snapshot even while the menu hides it from assistive technology. Imprint blur extends beyond the snapshot edges so it stays soft when scrolling upward through the About page's infinite loop.

## Development

Use Node.js 24 and pnpm 11.24.0, matching CI.

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
pnpm test:audit-fixes
pnpm test:staging
pnpm test:logo
pnpm test:team
pnpm test:responsive
pnpm test:work
pnpm test:imprints
pnpm test:cases
pnpm test:services
```

Browser checks expect the running production staging server at `http://127.0.0.1:3100`. Set `STAGING_URL` to check another preview. Install the browsers with `pnpm exec playwright install chromium firefox webkit` (add `--with-deps` on Linux).

Select an engine with `STAGING_BROWSER=chromium`, `STAGING_BROWSER=firefox` or `STAGING_BROWSER=webkit`. The smoke check includes two complete homepage scroll cycles, native scroll restoration on reload and Back, and heading blur matching the restored position.

`test:audit-fixes` covers mobile Close → Menu → Back scroll unlocking, server-rendered video posters, and one main landmark per page. `test:team` checks the v5 sequence's decoded frame identity, dimensions, interpolation, ordered playback, bounded loading, fallback, rotation and cleanup.

`.github/workflows/quality.yml` runs on pushes and pull requests to `staging` and `main`. Chromium and Firefox run on Ubuntu 24.04; WebKit runs on macOS 15 to cover Safari’s platform. Each job installs the frozen lockfile, runs lint and the staging build, installs its browser with system dependencies, and runs the checks above plus the cursor check against a `STAGING=1` production server on port 3100. Each browser suite has its own step and five-minute limit; the logo suite runs layouts sequentially and allows fifteen minutes for the macOS runner. Chromium also checks the unlisted Outpost draft. Failed jobs retain screenshots and the server log for seven days. Require all three `Quality (browser)` checks in branch protection to enforce the merge gate; a successful Vercel deployment alone does not establish that these checks passed. Action versions follow the official [checkout](https://github.com/actions/checkout/tree/v7.0.1), [setup-node](https://github.com/actions/setup-node/tree/v7.1.0) and [upload-artifact](https://github.com/actions/upload-artifact/tree/v7.0.2) documentation.

Visual acceptance preserves the 10px desktop text, grain, blur treatment, intentional Team/menu overlap, monochrome portfolio covers, and scroll-driven portrait sequence. Video controls stay hidden during normal autoplay; reduced-motion mode keeps manual playback controls. Check the work title, Team section, mobile menu, and a case study at desktop, tablet, and mobile widths before merging.

`test:responsive` covers hybrid touch/mouse input, finite scrolling on touch-only devices, tablet headings, landscape portraits at 667×375, 844×390 and 932×430, short desktop windows, partially visible project selection, and video decoding fallback. The larger landscape checks rotate from portrait and verify that the pinned portrait and its head remain visible. It accepts the same `STAGING_URL` and `STAGING_BROWSER` settings.

`test:work` covers the Datalane default, returning to the selected project, rapid switching, short-window content, touch swipes and the case-page noise treatment. Swipe left or right on the Work cover to change projects; the first and last projects stop at the ends of the list. Project selection is kept in the URL so Close, browser Back and reload retain it. Case-study images and videos sit above the noise overlay; the background, text and surrounding spacing keep the original grain. Work and other pages retain their full noise overlay.

Cover swipes lock to their initial direction and require a deliberate horizontal movement before changing projects. Partial swipes do not open a case. The right navigation remains fixed in short desktop windows, with its own scrolling when its contents cannot fit.

On desktops with a mouse or trackpad, Up/Down arrows select the previous/next project, including on hybrid laptops with a touchscreen. Vertical wheel input and horizontal trackpad swipes can keep advancing projects during one continuous gesture, with a small movement threshold and 200ms between switches. Changing direction or starting a fresh gesture responds immediately. Wheel and swipe transitions use an 80ms fade out and a 120ms fade in, completing before the next switch; reduced-motion mode switches immediately. Rapid mobile swipes update the pending project without restarting the outgoing fade. The project menu uses CSS sticky positioning without a pin spacer, so it cannot add phantom page overflow. In short windows, vertical wheel input first scrolls the content and can continue into project selection at the top or bottom. Direct `?case=` links render the selected project on the server, including when JavaScript is disabled.

The Branding / Experience / Product reel moves each blurred strip with a 3D transform. Scroll velocity gently increases its speed, and it eases back to its normal speed when scrolling stops. Reduced motion keeps the titles still. `pnpm test:services` checks mobile timing, recovery after scrolling, synchronized repetition and reduced motion in all three browser engines. The responsive suite also runs this check in CI.

Page imprints retain only the two previous viewports: the newest at 50% opacity and the older at 30%, both blurred by 4px. New imprints dissolve from clear ink over 800ms; reduced-motion mode shows the settled layers immediately. Work keeps the imprints faint, and individual case pages hide them. The two layers survive reloads within the same tab. `test:imprints` checks the layer limit, dissolve, case-page exclusion, SVG capture, homepage loops, history navigation, and storage fallback in Chromium, Firefox or WebKit.

## Video assets

Videos load from the project folders on `https://klad.b-cdn.net/`, as mapped in `src/data/videos.json`. Desktop playback uses full-resolution files; phones and tablets use smaller H.264 Level 4.1 files. A decode or loading failure retries the smaller file automatically. Circus uses the same approved smaller files on all devices.

To regenerate the upload files and `src/data/videos.json`, install FFmpeg and run `node scripts/prepare-videos.mjs`. The script caches source files in ignored `artifacts/video-sources`, writes prepared files to ignored `artifacts/video-uploads`, repairs full-resolution metadata without re-encoding, and validates the generated files. Upload each project folder directly to Bunny storage: `artifacts/video-uploads/chainviz/1-hd.mp4` maps to `https://klad.b-cdn.net/chainviz/1-hd.mp4`. Purge affected URLs after replacing existing files. These prepared copies are excluded from the deployed product; playback uses the CDN.

## Media regeneration and cleanup

The 29 October 2026 cleanup archived old prepared media, source caches, experiment Git history and the Team v4 source sequence in `/Users/zmaznevegor/Projects/klad-web-archive-2026-10-29`. Keep that archive outside the product tree. Generated check screenshots and new media caches belong in ignored `artifacts/`.

The deployed Team sequence is `public/images/team-mobile/v5`. Regenerate it from the complete archived 122-frame, 832px source sequence by passing its directory explicitly:

```sh
node scripts/prepare-team.mjs /Users/zmaznevegor/Projects/klad-web-archive-2026-10-29/public/images/team-mobile/v4
```

The script validates transparency, dimensions and visual error before writing v5 assets. An ordinary install or build uses the checked-in frames and does not require the archive.
