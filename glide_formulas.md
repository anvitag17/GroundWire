# Glide Computed Columns & Formulas (GroundWire)

This guide documents the key computed columns used in GroundWire so others can fork and extend the app quickly.

## Tables (Sheets)
- **About** — cards for goals, benefits (Economic, Environmental, Trees, Ponds, etc.).
- **Alerts** — time‑sensitive items (deadlines, hearings, livestreams).
- **Take Action** — petition, volunteer info, steps to contact officials.
- **Officials** — Federal / State / County / Education contacts with email/phone/district.
- **Volunteer Sign‑Up** — submissions table (do not expose private columns to UI).
- **Media Coverage** — articles with Date, Title, Source, URL, Image_URL, Description.

## Core Columns

### 1) `Order` (Number)
Manual sort index; set the display order.  
**Collection → Sort:** `Order` ascending.

### 2) `Category` / `Section` / `Level` (Text)
Enables **Group by** (e.g., Alerts grouped by “Deadline / Hearing / Livestream”; Officials grouped by “Federal / State / County / Education”).

### 3) `Pinned` (Boolean)
If `true`, show first.  
**Visibility:** `Pinned is true` → pin to top banners.

### 4) `Image_URL` (Text) — built via JS/Formula
Direct image links for colorful Cards/Tiles.

**Glide JavaScript column example (JS Column: `Compute_Image_URL`)**
```js
function imageUrl(url) {
  if (!url) return "";
  const yt = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  const fb = url.match(/(?:v=|\/videos\/|video_id=|story_fbid=)(\d+)/);
  if (fb) return `https://graph.facebook.com/${fb[1]}/picture?width=1200`;
  const gd = url.match(/\/d\/([-\w]{25,})|[?&]id=([-\w]{25,})/);
  if (gd) return `https://drive.google.com/uc?export=view&id=${gd[1]||gd[2]}`;
  return "";
}
```

**Google Sheets fallback:**
```excel
=IFERROR(
  IF(REGEXMATCH(A2,"facebook\.com"),
     "https://graph.facebook.com/" & REGEXEXTRACT(A2,"(?:v=|/videos/|video_id=|story_fbid=)([0-9]+)") & "/picture?width=1200",
  IF(REGEXMATCH(A2,"drive\.google\.com"),
     "https://drive.google.com/uc?export=view&id=" & REGEXEXTRACT(A2,"[-\w]{25,}"),
  IF(REGEXMATCH(A2,"(?:youtube\.com/watch\?v=|youtu\.be/)"),
     "https://img.youtube.com/vi/" & REGEXEXTRACT(A2,"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})") & "/hqdefault.jpg",""))),
"")
```

### 5) `Template_ContactMailto` (Template)
Prefill email subject/body for “Contact Official” button.

**Template value:**
```
mailto:[Email]?subject=Golden-to-Mars%20Feedback&body=Dear%20[Name],%0D%0A%0D%0A
```
Bind `[Email]` and `[Name]` from the row via Lookups.

### 6) `If-Then-Else` (Badges & Chips)
- If `Category = "Deadline"` → Badge color Orange
- If `Category = "Hearing"` → Badge color Green
- Else → Blue

### 7) `Relation` + `Lookup`
- `Rel_Level → Officials.Level` to group/filter by **Federal / State / County / Education**.
- `Lookup_Email` from `Rel_Level` to pull the right contact.

### 8) `Visibility` Rules
- Hide empty fields: `This item’s [Phone] is empty` → don’t show the call button.
- Only show “Join Livestream” when `Livestream_URL is not empty`.

### 9) `Actions / Workflows`
- **On Submit (Volunteer Form):**  
  - **Send email** (Glide action) or **Call webhook** → Apps Script → MailApp.
- **Row tap (Alerts/Media):**  
  - **Open link** (SCC page, petition, article).

## Tips
- Optimize images (Drive “view” links render fast).
- Use **Group by** + **Sort** for clean sections.
- Keep private PII columns hidden from layout (toggle column visibility).
- Add a `Project` column if you plan to support multiple cases beyond Golden-to-Mars (future‑proofing).

