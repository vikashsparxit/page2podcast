# Chrome Web Store Listing — Page2Podcast

## Extension name
Page2Podcast

## Short description (132 chars max — used in search results)
Turn any web page into a podcast episode. AI-generated script, audio, and one-click publishing to Spotify and Apple Podcasts.

(128 chars ✓)

## Category
Productivity

## Language
English

---

## Full description (paste into the store listing editor)

**Turn any article, doc, or web page into a podcast episode — script, audio, and published — without leaving your browser.**

Page2Podcast extracts the content of the current page, uses your choice of AI model to write a natural, conversational podcast script, generates a full MP3 using text-to-speech, and publishes directly to Buzzsprout — which distributes to Spotify, Apple Podcasts, and 20+ platforms. One side panel. No switching tabs.

**How it works**

1. Open any article, Google Doc, or web page
2. Click the Page2Podcast icon to open the side panel
3. Pick your AI model and click Generate Podcast
4. Review and edit the generated script
5. Generate audio and listen inline before downloading
6. Download your MP3 or publish directly to Buzzsprout

**Generate tab — from any web page**

- Extracts readable content from articles, blogs, Google Docs, and markdown pages
- Choose your AI model per episode: Gemini 2.5 Flash, Gemini 2.5 Pro, GPT-4o, or Claude Sonnet
- Writes a full podcast script following your episode template and podcast identity
- Inline audio player — listen before you download or publish
- AI-generated episode title and show notes, editable before publishing
- One-click publish to Buzzsprout as a draft or live episode

**Script tab — bring your own script**

- Paste any human-written or AI-generated script
- Generate audio from it directly — no page needed
- AI fill button generates episode title and show notes from your script
- Full download and Buzzsprout publish support

**Scouts tab — automated research pipeline**

- Connect a Yutori Scout to monitor any topic and pull the latest research updates automatically
- View scout updates and generate episodes directly from them
- Auto-generate mode: when a new update arrives, the extension generates the script, produces audio via ElevenLabs, and saves a Buzzsprout draft — all in the background while Chrome is open
- Chrome notification when a new draft is ready

**Podcast Identity — your show's voice, applied to every episode**

- Podcast name, host name, show description, category, target audience
- Sponsor line injected verbatim into every episode intro
- Episode format: solo deep-dive, interview, news roundup, narrative, or tutorial
- Episode template: paste your full segment-by-segment structure — the AI follows it exactly for every episode
- Episode length: Short (2–3 min), Medium (5–7 min), Long (8–10 min), Extra Long (12–15 min)
- Tone: Neutral, Educational, Casual, Salesy

**Buzzsprout Publishing**

- Publish episodes directly to Buzzsprout from the extension — distributed to Spotify, Apple Podcasts, and 20+ platforms via RSS
- Supports draft mode (review before going live) or immediate publish
- Episode title, show notes, host name, and category all sent automatically
- Works from the Generate tab, Script tab, and auto-generate pipeline

**History tab**

- Every generated episode saved locally — both from pages and manual scripts
- Click any entry to reload the script and re-generate audio

**What you need**

- A Gemini API key for AI script generation (Gemini 2.5 Flash is the default; Gemini 2.5 Pro available for best quality)
- An OpenAI or ElevenLabs API key for text-to-speech audio generation
- A Buzzsprout API key if you want to publish episodes directly to podcast platforms
- An Anthropic API key if you prefer Claude Sonnet for script generation (optional)
- All keys stored locally in your browser — never transmitted to any server we control

**Privacy**

Your API keys are stored locally using Chrome's built-in sync storage. When you generate a script, your page content goes directly from your browser to the AI provider you have configured — we never see it. When you generate audio, your script goes directly to your chosen text-to-speech provider. We collect no analytics, no personal data, and no usage data. Full privacy policy included.

---

## Permissions justification (for the review form)

**activeTab**
Required to read the title and URL of the active tab the user wants to convert to a podcast. Without this, the extension cannot identify which page to process.

**storage**
Required to persist user-provided API keys (Gemini, OpenAI, ElevenLabs, Anthropic, Buzzsprout, Yutori) and preferences (podcast name, host name, episode length, tone, episode template, model selection) locally using chrome.storage.sync. Also used to store episode history and pipeline state in chrome.storage.local.

**sidePanel**
Required to render the extension UI in Chrome's native side panel, so the panel stays open and visible alongside the page while the user reads, listens, and edits.

**alarms**
Required to schedule hourly background checks for new Yutori Scout research updates when the user enables auto-generate mode. The chrome.alarms API is the only way to schedule recurring tasks in a Manifest V3 service worker. The alarm only runs when the user has explicitly enabled this feature in Settings.

**notifications**
Required to alert the user when the auto-generate pipeline completes — either a success notification ("new Buzzsprout draft ready") or a failure notification with the specific error — so the user knows the result without having to open the extension.

**host_permissions: <all_urls>**
Required because the content extraction script must run on any website the user chooses to convert to a podcast. Users visit a wide variety of sites — news articles, blogs, Google Docs, documentation pages, product pages. Restricting to specific domains would make the extension non-functional for the vast majority of use cases. The content script only reads visible text when the user explicitly clicks Generate — it does not run automatically, track browsing, or transmit any data without a direct user action.

---

## Store assets checklist

### Required
- [ ] Icon 128×128 px — `icons/icon128.png` ✓
- [ ] At least 1 screenshot — 1280×800 px or 640×400 px
  - Screenshot 1: Generate tab — script generated, audio player visible
  - Screenshot 2: Scouts tab — scout detail with Generate Episode button
  - Screenshot 3: Settings — Podcast Identity card filled in
  - Screenshot 4: Script tab — manual script with AI fill
- [ ] Privacy policy URL — host `privacy.html` publicly (GitHub Pages recommended)

### Optional but recommended
- [ ] Promotional tile: 440×280 px — logo + name only, NO "Free", "Best", "#1", or badge text
- [ ] Marquee promo image: 1400×560 px

### ⚠ Tile image rules (learned from rejection)
Do NOT include any of the following on tile or promo images:
- "Free", "Best", "Top", "#1", "New", "Recommended", "Premium"
- Star ratings, download counts, review scores
- Any badge-style text implying ranking or performance

---

## Submission checklist

### Code
- [x] Manifest V3
- [x] Icons: 16, 48, 128 px
- [x] No remote code execution (no eval, no external scripts)
- [x] No inline event handlers in HTML (all listeners in .js files)
- [x] Privacy policy page (`privacy.html`) included
- [x] `options_page` set for user-accessible settings
- [x] Single-purpose: one clearly defined use case
- [x] All permissions declared in manifest with clear purpose
- [x] `scripting` permission removed (was unused — flagged in v1.0.0 rejection)

### Files to EXCLUDE from the ZIP
- CLAUDE.md
- README.md
- STORE_LISTING.md
- ROADMAP.md
- next-step.md
- create-icons.html
- generate-icons.js
- promo-assets.html
- .claude/ directory
- docs/ directory
- Any .git directory
- *.zip files

### Files to INCLUDE in the ZIP
- manifest.json
- background.js
- content.js
- popup.html / popup.css / popup.js
- options.html / options.css / options.js
- privacy.html
- icons/icon16.png
- icons/icon48.png
- icons/icon128.png

### ZIP command (run from the extension root)
```bash
zip -r page2podcast-v1.1.0.zip \
  manifest.json \
  background.js content.js \
  popup.html popup.css popup.js \
  options.html options.css options.js \
  privacy.html \
  icons/
```

### Submission URL
https://chrome.google.com/webstore/devconsole

---

## Version history

### v1.1.0 (current submission)
- Buzzsprout publishing (draft + live modes)
- Script tab — paste and convert manual scripts
- AI-generated episode title and show notes
- Inline audio player before download
- Podcast Identity — sponsor line, episode template, target audience, category, format
- Extra Long episode length (12–15 min)
- History tab — persists across sessions, includes manual scripts
- Yutori Scouts integration — create, view, pause, delete scouts via API
- Auto-generate pipeline — scout update → Gemini script → ElevenLabs audio → Buzzsprout draft → Chrome notification
- Model selector — Gemini 2.5 Flash, Gemini 2.5 Pro, GPT-4o, Claude Sonnet
- Anthropic API key support
- Google Docs content extraction fix
- One-scout enforcement in Settings
- Removed unused `scripting` permission (rejection fix)

### v1.0.0 (initial submission — rejected)
- Basic page → script → audio → download flow
- Gemini script generation, OpenAI/ElevenLabs TTS
- Settings for API keys, tone, length, podcast name, host name

---

## Common rejection reasons to pre-empt

| Risk | Status |
|---|---|
| Overly broad permissions without justification | ✓ All permissions justified above |
| Unused permissions | ✓ `scripting` removed; all remaining permissions actively used |
| Missing privacy policy | ✓ privacy.html included; host publicly for the URL field |
| Misleading description | ✓ Description matches actual functionality exactly |
| Remote code loading | ✓ None — all code bundled locally |
| Eval or obfuscated code | ✓ None |
| Deceptive name/icon | ✓ Name and icon are original and descriptive |
| Collecting data without disclosure | ✓ No data collected; full privacy policy provided |
| Promotional tile with ranking/badge text | ✓ Warned above — do not include "Free", "#1", etc. on tile |
| **Keyword spam (violation ref: Yellow Argon)** | ✓ Fixed — removed clustered third-party brand name lists from short description, "What you need", and Privacy sections. Brand names now appear only in genuine functional context or removed entirely. |
