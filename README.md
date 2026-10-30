# Xebia Christmas Market 🎄

A cozy pixel-art (Habbo Hotel style) Christmas market. Every Xebian picks
**one** item: a gift package from a local supplier, or a donation to charity.
Live at <https://christmas.bngrd.com>.

Flow: **landing → present or donate? → market square → stall / giving booth
(WWF: pick an animal to adopt) → drop-off location (presents and WWF adoption
packs) → review → confirm in Microsoft Forms.**

## How orders are collected

A static site can't post into Microsoft Forms directly (there's no public API).
Instead, the review page opens the Form with every answer **pre-filled**. The
person signs in with their Xebia account and presses Submit. Responses end up
in Forms / Excel like any other form.

### Set up the Form (once)

1. Create a Microsoft Form with these questions (names are up to you):
   | Question | Type | Options |
   | --- | --- | --- |
   | Type | Choice | `Present`, `Donation` |
   | Choice | Text | (filled with the Dutch `formName`, e.g. `Olala Chocola – Workshop bonbons maken` or `WWF – Adopteer een tijger`) |
   | Drop-off location | Choice | exactly the values in `LOCATIONS`, plus `Not applicable (donation)` |
2. Settings → **Only people in my organisation can respond** and **Record name**.
   That's how the Xebia email is captured and verified, so the site doesn't ask for it.
3. **…** → **Get pre-filled URL** → fill in every question → **Get pre-filled link**.
4. Copy the link into `src/config.ts`:
   - `FORM_URL` = the link up to and including `id=...` (drop the `r...=` parameters)
   - `FORM_FIELDS` = the `r<hash>` parameter name of each question
5. Do a test order and check that every answer shows up filled in. Choice
   options only get pre-selected when the text matches exactly.

People can still change the pre-filled answers in the Form. For an internal
event that's fine. Turn on *One response per person* in the Form settings so
everyone really gets one pick.

## Editing content

- **Locations:** `src/config.ts`
- **Charities, WWF animals, suppliers, packages (names, descriptions):**
  `src/catalog.ts`. The site shows the English `name`; the Form gets the
  Dutch `formName`, the name the stall itself uses.
- **The market square scene** (stall positions, LED sign text, people): `src/scene/village.ts`
- **Pictures:** every entry has an `image` path relative to `src/images/`
  (`suppliers/<supplier>/<package>.jpg`, `charities/wwf/<animal>.jpg`, and
  `charities/<id>.svg`: the charity's official logo on a white 4:3 card). Vite bundles
  them with hashed filenames, and `npm test` fails if one is missing. Photos
  are 4:3 JPEGs at full resolution in sRGB (crop them first: cards are 4:3
  and get center-cropped). The build turns each into a range of widths up to
  the original (`vite-imagetools`, see `vite.config.ts`), so every screen
  downloads only the size it needs. Clicking a package photo shows the
  uncropped original when there is one at `suppliers/<supplier>/full/<same
  name>.jpg` (strip its metadata first: phone photos carry GPS). An entry
  without a photo can point at a pixel-art `.svg`:
  `node scripts/make-placeholders.ts` generates any missing ones (never
  overwrites existing files unless you pass `--force`).
- **Package ids** are `<supplier>-<slug>` and are what a pick is stored as, so
  keep a slug when you only reword a package.

## Development

See `CLAUDE.md` for commands and the pre-commit gate.
