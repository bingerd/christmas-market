# Xebia Christmas Market 🎄

A cozy pixel-art (Habbo Hotel style) Christmas market. Every Xebian picks
**one** item: a gift package from a local supplier, or a donation to charity.
Live at <https://christmas.bngrd.com>.

Flow: **landing → present or donate? → market square → stall / giving booth →
service line + drop-off location → review → confirm in Microsoft Forms.**

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
   | Choice | Text | (filled with e.g. `Olala Chocola – Bonbon box` or `Donation to Free a Girl`) |
   | Service line | Choice | exactly the values in `SERVICE_LINES` |
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

- **Service lines, locations:** `src/config.ts`
- **Charities, suppliers, packages (names, descriptions):** `src/catalog.ts`
- **The market square scene** (stall positions, LED sign text, people): `src/scene/village.ts`
- **Pictures:** every entry has an `image` path under `public/images/`.
  Replace the placeholder with a real photo (keep the filename, or point
  `image` at the new file, e.g. `.jpg`). Photos get downscaled a little to fit
  the pixel style; set `PIXELATE_PHOTOS_TO = 0` to turn that off.
  `node scripts/make-placeholders.ts` regenerates any missing placeholders
  (never overwrites existing files unless you pass `--force`).

## Development

See `CLAUDE.md` for commands and the pre-commit gate.
