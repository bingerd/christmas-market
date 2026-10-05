# Xebia Christmas Market

Static Vite + vanilla TypeScript site (pixel-art / Habbo style). Orders are
collected through a pre-filled Microsoft Forms link; there is no backend.
Imports use explicit `.ts` extensions so `scripts/` can run under plain Node.

## Commands

```bash
npm run dev        # http://localhost:5173
npm test           # vitest run
npm run test:watch
npm run typecheck  # tsc -b --noEmit
npm run lint       # oxlint
npm run build      # tsc -b && vite build -> dist/ (+ dist/404.html for Pages)
npm run preview    # serve the production build, http://localhost:4173
node scripts/make-placeholders.ts   # regenerate missing placeholder images
```

Before committing, run the full gate:

```bash
npm test && npm run typecheck && npx oxlint && npm run build
```

CI (`.github/workflows/deploy.yml`) only builds and deploys to GitHub Pages on
push to `main` — it does **not** run tests, typecheck or lint. Those are local
gates, so do not skip them.

## Where things live

- `src/config.ts` — service lines, locations, Form URL + question ids
- `src/catalog.ts` — charities, suppliers and their packages
- `src/pick.ts`, `src/formLink.ts` — pure logic (unit tested); one pick per person
- `src/views/` — page rendering (`pages.ts`) and shared bits (`ui.ts`)
- `src/scene/` — the pixel world: isometric helpers, 3×5 pixel font, skyline,
  market square (`village.ts`, used as hero and as interactive map), parallax
- `src/sprites.ts`, `src/pixel.ts` — pixel-art sprites as SVG

Design: keep everything pixel art (the owner loves it). Atmosphere comes from
the fixed night backdrop, warm light pools/halos and subtle motion; text lives
on glass panels with pixel-notched corners. Respect `prefers-reduced-motion`.
