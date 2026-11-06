# Casimir Pasa"buy" — project handoff

Pasabuy (personal shopping) run by Cath and her partner during their Bangkok trip, **Nov 13–20, 2026**.
They buy **Milk Love Whimsical House Fancon** merch at the booth on **Sun Nov 15** (Union Hall, Union Mall, Bangkok; they have fancon tickets)
and MuvMuv / MilkLove items from the **GMMTV Shop**, then ship to buyers in the Philippines.

## Live links
- Order website (public, for buyers): https://cathlauron.github.io/casimir-pasabuy/
- Order tracker (private, Google sign-in): https://cathlauron.github.io/casimir-pasabuy/tracker/
- Repo: https://github.com/cathlauron/casimir-pasabuy — GitHub Pages serves `main` / root. A push to `main` goes live in ~1–2 min (Pages build can sit in GitHub's queue for several minutes; an empty commit re-triggers it).

## Business rules (confirmed by Cath)
- Prices: baht × **₱1.92** (locked rate) × **1.12** (12% markup), rounded **up** to the whole peso. Only peso prices are shown — no baht, no rate, no "how prices are computed".
- Exception: **Collectible Random Card = flat ₱550** (`fixed:550`), not the formula.
- **Full payment via GCash** (InstaPay QR on the page, account `AN*****A P.`). Buyers pay only **after** Cath confirms slots by DM.
- Order cut-off **Nov 14, 11:59 PM**. Refunds by **Nov 16**. Shipping in PH from **Nov 21**; buyer pays local shipping separately; **no meetups**.
- If sold out: buyer chooses **full refund** or **swap** for a GMMTV Shop item (pays the difference; if cheaper, the difference is refunded; if the backup is also gone, full refund). GMMTV Shop items are refund-only.
- Random items can't be chosen/exchanged. No cancellation after purchase.
- Contact: IG / TikTok **@csmrzrzr**. Orders are captured only when the buyer DMs the order message.

## Slots (max quantities Cath can carry)
Fancon: random card 10 · transparent photo set 10 · Talkie doll 5 · card holder 5 · T-shirt 5 (shared across S–XXL) · acrylic display 5 · random doll keychain **single box only, 6** (whole 8-box set NOT offered) · headband 5 · journey bag 5 · phone strap 5.
GMMTV Shop items: 5 each (33 items that were in stock on shop.gmm-tv.com/collections/muvmuv on Oct 30, 2026).

**Current status:** Collectible Random Card is **cut off** (`closed:true`) as of Nov 5.

## Order website — `index.html` (single file + `img/`)
Static page, no backend. Edit the data block near `const FANCON = [` / `const SHOP = [`:
- Change slots: set `max:` on the item (the "N slots available" text uses it). `closed:true` = greyed out with "CUT OFF" tag and the + button disabled.
- Fixed price: `fixed: <pesos>`. Otherwise price = `Math.ceil(thb*1.92*1.12)` via `price(i)`.
- Leftover from the removed admin panel: `<script id="slots-state">` / `SLOTS` — harmless, `{}`; can be used for per-item overrides.
- Flow: pick items → details form (contact, PH address, courier) → per-item sold-out choice → GCash QR + account name/ref → "Last step: review & send" (summary + 2 agreement checkboxes) → **Review & send my order** (also the sticky bottom-bar button) → modal with order ID `CSB-XXXXX`, "Copy & open Instagram DM" (`https://ig.me/m/csmrzrzr`) / TikTok, "I've sent my order" tick.
- The copied order message format is what the tracker parses — **if you change it, update the tracker parser too.**
- Cath removed on purpose (don't re-add): baht prices, "rate locked" chip, "how prices are computed" and "are slots guaranteed" FAQs, "max N" labels, the old "Check out" button, the admin slot panel.
- Photos: fancon items are crops of the official poster or photos Cath supplied (`talkie`, `card`, `bag`, `tee`, `randoll`); `s_*.jpg` are GMMTV Shop product photos (600px). `avatar.png` = Cath's sticker (head + shoulders, circle). `gcash-qr.png` = payment QR.
- Mobile-first; test at 390px width.

## Order tracker — `tracker/index.html`
Same UI as the earlier Claude-hosted tracker, now on **Firebase** (project `casimir-pasabuy`, Firestore collection `orders`, doc id = order ID).
- Google sign-in; admins: `catherine.lauron26@gmail.com`, `angelitapunzalan1999@gmail.com` (the `ADMINS` list in the module script only gates the UI — **Firestore Rules are the real protection**).
- Firestore Rules (set in the Firebase console):
  ```
  match /orders/{id} { allow read, write: if request.auth != null
    && request.auth.token.email_verified == true
    && request.auth.token.email in ['catherine.lauron26@gmail.com','angelitapunzalan1999@gmail.com']; }
  ```
- `cathlauron.github.io` must stay in Firebase Auth → Authorized domains.
- Paste-to-add: paste one **or several** buyer DM messages; `splitOrders()` splits on `CASIMIR PASA"BUY" ORDER CSB-`, `cleanPaste()` strips `[text](mailto:/tel:/https:)` link formatting, bullets `-`/`•`/etc. are accepted. Existing IDs → "Replace with pasted version" (keeps payment/refund/shipping fields).
- Per order: payment status/amount/GCash ref, booth purchase status, swap notes, refund due/status/ref, shipping fee/paid/status/tracking, notes. Marking Paid fills amount; marking Sold out sets refund Pending. Tabs: Orders, Buying list (paid vs unpaid quantities per item/size). Copy as CSV.
- The tracker page is unlinked from the order page and has `noindex`.

## Marketing assets — `tools/`
- `tools/poster/poster.html` — peso version of the official merch poster (`560f7764-image.png` base). Replaces baht hearts with peso hearts, covers the advance-purchase box with shop info + QR (`qr.png` → the website). Render with Playwright at 1080×1345, deviceScaleFactor 2. Needs `npm i @fontsource/fredoka @fontsource/nunito` in `tools/poster/`. The random card heart shows ₱550 (not yet marked cut off on the poster).
- `tools/video/rec.js` — Playwright script that films the order page frame-by-frame (9:16, 1080×1920, 30fps) with step captions and tap rings, then `ffmpeg -framerate 30 -i frames/%05d.jpg -vf crop=1080:1920:0:0,format=yuv420p -c:v libx264 -crf 20`. Paths inside are absolute from the original environment — adjust before running. `timing.txt` = caption timings for Cath's voiceover. Note: it adds the random card, which is now cut off — update the script before re-filming.
- TikTok hook direction Cath liked: highlight that **we built a website so buyers can order easily**.

## Working with Cath
- Show changes on a phone-width screenshot before publishing when the change is visual.
- Commit as `cathlauron`, then confirm the Pages build finished and the live page loads.
