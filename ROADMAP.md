# Page2Podcast — Product Roadmap

> Last updated: 2026-04-13
> Status tracker: each phase has a checkbox list. Check items off as they ship.

---

## Current state (v1.0 — shipped)

- Chrome Extension MV3, opens as side panel
- Gemini API → podcast script generation
- OpenAI TTS / ElevenLabs TTS → MP3 audio
- Download MP3
- Publish to Buzzsprout → Spotify / Apple Podcasts distribution
- Podcast Identity settings (name, host, description, category, episode format, target audience, custom segments)
- 5 episode formats: solo deep-dive, interview, news roundup, narrative storytelling, educational tutorial
- History tab (persists in `chrome.storage.local`)

---

## Phase 1 — Data Persistence ✅ COMPLETE

**Goal:** History survives browser restarts.

- [x] Move `chrome.storage.session` → `chrome.storage.local` for podcast history
- [x] Increase history cap from 30 → 100 entries

**Shipped:** 2026-04-06

---

## Phase 2 — Backend API + Authentication

**Goal:** Real user identity, cross-device history, foundation for all future phases.

**Why this unlocks everything else:** The Chrome extension has no public URL, so it can't receive webhooks (Scouts), run FFmpeg (video), or manage OAuth tokens (YouTube, Instagram). The backend is the prerequisite for Phases 3, 4, and 5.

### Infrastructure
- [ ] Provision Node.js API on Railway or Render (free tier to start)
- [ ] PostgreSQL database (Railway managed Postgres or Supabase)
- [ ] Firebase project (Auth only — not Firestore)

### Authentication
- [ ] Firebase Auth via `chrome.identity.getAuthToken` in extension
  - Zero-click Google sign-in — uses the Google account already in Chrome
  - Extension gets a Firebase ID token, sends it as `Authorization: Bearer <token>` on every API call
  - Backend verifies JWT with Firebase Admin SDK
- [ ] Auth state in extension: signed-in vs. anonymous mode
- [ ] Settings UI: "Sign in with Google" button + account display

### Database schema
```sql
users (id, firebase_uid, email, created_at)

episodes (
  id, user_id, title, page_url, created_at,
  script TEXT,
  audio_url TEXT,          -- S3/GCS signed URL (Phase 3+)
  podcast_profile JSONB,   -- snapshot of settings at generation time
  buzzsprout_episode_id TEXT,
  published_at TIMESTAMP
)

scouts_feeds (            -- stub table, populated in Phase 4
  id, user_id, scout_id, topic, cadence, last_triggered_at, active BOOLEAN
)
```

### API endpoints
- [ ] `POST /auth/verify` — validate Firebase token, upsert user row
- [ ] `GET  /episodes` — paginated episode history for authenticated user
- [ ] `POST /episodes` — save episode after generation (called by extension)
- [ ] `POST /tts` — move TTS generation server-side (fixes binary transfer complexity permanently)
- [ ] `POST /script` — move Gemini script generation server-side (optional, but cleaner)
- [ ] `POST /webhooks/scouts` — stubbed endpoint, returns 200, logs payload (wired up in Phase 4)

### Extension changes
- [ ] History tab reads from `/episodes` API when signed in, falls back to `chrome.storage.local` when signed out
- [ ] After each generation, `POST /episodes` to sync to DB
- [ ] Remove base64 audio hack — TTS now returns audio from backend as a signed URL or stream

**Acceptance criteria:**
- User signs in once, history persists across devices and browser reinstalls
- Anonymous mode still works (local storage only)
- All API keys stay in extension `chrome.storage.sync` (never sent to backend)

---

## Phase 3 — Video Podcast Generation

**Goal:** Same content pipeline → MP4 video podcast + vertical clips for Shorts / Reels.

**Prerequisite:** Phase 2 backend (FFmpeg runs server-side, files stored in S3/GCS).

### Option A — HeyGen Seedance 2.0 (avatar-based, preferred)

HeyGen launched Seedance 2.0 (Apr 10 2026) with full global availability and three relevant features:

| Feature | Fit |
|---|---|
| **Avatar Shots** | Best fit — AI avatar of the host reads the episode script. One video per episode, consistent visual identity. |
| **Video Agent** | 3-min cap makes it too short for Medium/Long episodes — not viable for full episodes |
| **AI Video Generator** | Could generate B-roll cutaway footage — useful as future enhancement |

**Why Avatar Shots over FFmpeg waveform:**
- Dramatically more engaging than a static waveform visualizer
- Consistent host identity across all episodes (like a real podcaster's face cam)
- No need to manage FFmpeg complexity on the backend
- Users bring their own HeyGen API key — same pattern as ElevenLabs

**Open questions to resolve before building:**
- [ ] Confirm Seedance 2.0 Avatar Shots has a REST API (not just web UI) — check HeyGen developer docs
- [ ] Understand credit cost per video minute — needed for pricing guidance to users
- [ ] Check output format — expect MP4, but confirm resolution options
- [ ] Confirm Buzzsprout accepts MP4 video episodes (likely yes — they support video podcasts)

**Target flow (extension-side, no backend required if HeyGen handles rendering):**
1. User generates script + audio as normal
2. "Generate Video" button appears after audio is ready
3. Extension sends script text + audio (or audio URL) to HeyGen Avatar API → returns job ID
4. Extension polls HeyGen job status every 10s
5. On completion: inline MP4 preview + "Download Video" + "Publish to Buzzsprout (video)"

**If HeyGen API is not yet available for Seedance 2.0**, fall back to Option B and revisit HeyGen in v1.3+.

---

### Option B — FFmpeg waveform (fallback, no avatar)

**Prerequisite:** Phase 2 backend (FFmpeg runs server-side, files stored in S3/GCS).

#### Infrastructure additions
- [ ] FFmpeg on backend (Railway/Render supports it)
- [ ] S3 or GCS bucket for video output files
- [ ] BullMQ + Redis for async render job queue (video renders take 2–5 min)
- [ ] OpenAI Whisper API for caption/subtitle generation from audio

#### Video formats
Three output types from one generation:

| Format | Dimensions | Length | Use |
|---|---|---|---|
| Video podcast | 1920×1080 | Full episode | YouTube, Buzzsprout |
| YouTube Short | 1080×1920 (vertical) | 60s highlight | YouTube Shorts |
| Instagram Reel | 1080×1920 (vertical) | 30–90s | Instagram |

#### Video composition (per episode)
- [ ] Background: animated waveform visualizer synced to audio (Canvas / FFmpeg `showcqt`)
- [ ] Title card: podcast name, episode title, host name
- [ ] Captions: Whisper transcription → timed SRT → burned in with FFmpeg
- [ ] Branding: configurable accent color, logo overlay
- [ ] Short/Reel cut: auto-extract the hook (first 30–60s) as the vertical clip

#### API endpoints
- [ ] `POST /video/render` — enqueue render job, return `{ jobId }`
- [ ] `GET  /video/jobs/:id` — poll job status (`queued | rendering | done | failed`)
- [ ] `GET  /video/jobs/:id/download` — signed URL for completed video file

---

### Extension changes (shared across both options)
- [ ] "Generate Video" button appears after audio is ready (alongside Download MP3)
- [ ] Progress indicator: polls job status every 5–10s, shows render progress
- [ ] On completion: Download Video Podcast, Download Short (Option B), Download Reel (Option B)
- [ ] Video generation is opt-in (some users will only want audio)
- [ ] HeyGen API key field in Settings (Option A only)

---

## Phase 4 — Scouts Integration (Yutori)

**Goal:** Scouts AI agents monitor the web → automatically feed Page2Podcast → episode published while you sleep.

**Prerequisite:** Phase 2 backend (webhook needs a public URL).
**Dependency:** Yutori Scouts API / webhook access (currently on waitlist — join at scouts.yutori.com).

### The integration model
```
Scout monitors topic (news, research, prices, competitors...)
        │
        │  Scout fires webhook when findings are ready
        ▼
POST /webhooks/scouts
        │
        ├── parse multi-source findings into content brief
        ├── Gemini → podcast script (research digest mode)
        ├── TTS → audio
        ├── (optional) Video render job → MP4
        └── Publish to Buzzsprout → Spotify / Apple Podcasts
```

User wakes up. Episode is already in their feed.

### Scouts webhook payload (design target — finalize when Scouts API docs available)
```json
{
  "scout_id": "abc123",
  "topic": "AI startup funding rounds",
  "triggered_at": "2026-04-06T08:00:00Z",
  "findings": [
    { "title": "...", "url": "...", "summary": "...", "source": "TechCrunch" },
    { "title": "...", "url": "...", "summary": "...", "source": "The Verge" }
  ],
  "synthesized_summary": "This week in AI funding: ..."
}
```

### Gemini prompt: research digest mode
A new prompt branch (alongside existing single-page mode) that:
- Treats `findings[]` as the content source instead of a single page
- Maps naturally to the "News Roundup" episode format
- Credits sources conversationally ("I came across three stories this week that all point to the same thing…")
- Can synthesize across conflicting or complementary findings

### Extension / Backend additions
- [ ] `POST /webhooks/scouts` — full implementation (was stubbed in Phase 2)
- [ ] Scouts manager UI in extension: connect Scout, choose topic, set cadence (every finding vs. daily digest vs. weekly)
- [ ] Per-Scout podcast profile override (a Scout on AI news might use different format/tone than one on health research)
- [ ] "Auto-generate" toggle per Scout: generate+publish automatically vs. generate draft for review first
- [ ] Notification when episode auto-publishes (Chrome notification API)

### Use cases enabled
| Scout monitors | Page2Podcast generates |
|---|---|
| AI / tech news | Daily tech briefing podcast |
| Research papers in your field | Weekly academic digest |
| Competitor product updates | Competitive intelligence episode |
| Industry funding rounds | Startup investor roundup |
| Any topic you care about | Your personalized niche show |

### Action items right now (before API access)
- [ ] Join Yutori Scouts waitlist: https://scouts.yutori.com
- [ ] Reach out for developer / early integration partner access
- [ ] Mock webhook payload locally and build handler against it
- [ ] Design per-Scout configuration schema in DB

---

## Phase 5 — Platform Publishing

**Goal:** Fully autonomous publish to YouTube (video) and Instagram — no copy-pasting, no manual steps.

**Prerequisite:** Phase 3 (video file exists as MP4), Phase 2 (backend handles OAuth tokens securely).

---

### SEO metadata strategy — what goes where

| Metadata | Buzzsprout / Spotify / Apple | YouTube (direct upload) |
|---|---|---|
| Episode title (keyword-first) | ✅ Title field | ✅ Video title |
| Show notes (keyword-rich paragraph) | ✅ Description field → RSS | ✅ Top of video description |
| Chapter list (text) | ✅ Readable in show notes | ✅ **Clickable** progress bar markers |
| Tags / hashtags | ❌ Not in podcast RSS | ✅ YouTube tags field |
| Thumbnail text | ❌ N/A | ✅ Image overlay on video thumbnail |

**Key distinction:** Chapter timestamps (`0:00 — Cold open`, etc.) are interactive progress-bar markers **only** on directly uploaded YouTube videos. When Buzzsprout distributes via RSS to YouTube Music/Podcasts, chapters appear as plain text — not clickable. Autonomous YouTube upload is the only path to clickable chapters.

**Current state (v1.1.0):** SEO metadata panel in the extension lets you copy chapters, tags, and thumbnail text manually. Buzzsprout show notes are auto-generated with keyword-rich content that flows to Spotify and Apple via RSS.

---

### Autonomous YouTube pipeline (target architecture)

```
Audio generated (MP3)
        │
        ▼
Small backend endpoint (Railway — one function)
  POST /video/render
  Input:  { audioBase64, coverImageUrl, title }
  FFmpeg: ffmpeg -loop 1 -i cover.jpg -i audio.mp3 -shortest -c:v libx264 -c:a aac output.mp4
  Output: MP4 file (static cover image + audio)
        │
        ▼
YouTube Data API v3 — videos.insert
  title:       SEO_TITLE from metadata block
  description: show notes + "\n\n" + chapter timestamps
  tags:        TAGS from metadata block
  thumbnail:   auto-uploaded separately (coverImage with THUMBNAIL_TEXT overlay)
        │
        ▼
Chrome notification: "Episode live on YouTube → [link]"
```

**Why static image + audio (not waveform or HeyGen yet):**
- One FFmpeg command, no render queue needed
- Produces a valid MP4 YouTube accepts
- Fast: 30s render for a 10-min episode
- Upgrade to animated waveform or HeyGen avatar later without changing the upload flow

### Infrastructure needed (minimal)

- [ ] Railway (or Render) free-tier Node.js service with FFmpeg
- [ ] `POST /video/render` endpoint — accepts audio + cover image, returns MP4 presigned URL or base64
- [ ] Podcast cover image upload in Settings (stored in S3/GCS or as base64 in sync storage if small enough)

### YouTube OAuth (extension-side, no backend needed for auth)

- [ ] `chrome.identity.launchWebAuthFlow` with YouTube Data API scope (`https://www.googleapis.com/auth/youtube.upload`)
- [ ] Tokens stored in `chrome.storage.local` (not sync — too large)
- [ ] Token refresh handled in background.js
- [ ] "Connect YouTube" button in Settings → shows connected channel name when linked

### YouTube upload flow

- [ ] After audio generated: "Publish to YouTube" button appears (alongside Buzzsprout)
- [ ] Extension hits `/video/render` → polls for MP4 → uploads via YouTube Data API
- [ ] Title, description (show notes + chapters), tags all sent automatically from SEO metadata block
- [ ] Thumbnail uploaded separately with THUMBNAIL_TEXT overlaid via Canvas API (no backend needed)
- [ ] On success: notification + YouTube video URL stored in history entry

### Instagram (later — needs video too)

- [ ] OAuth 2.0 via Instagram Graph API (requires Facebook Developer app)
- [ ] Same MP4 used for Reels (crop to vertical 9:16 — second FFmpeg pass)
- [ ] Caption auto-generated from show notes + hashtags from tags field
- [ ] Store Instagram media ID in history

### Spotify / Apple Podcasts

Already fully covered via Buzzsprout RSS — no additional work needed.

### Extension changes

- [ ] "Connected accounts" card in Settings: YouTube OAuth status, disconnect option
- [ ] Publish buttons: Buzzsprout + YouTube side by side after audio generation
- [ ] History tab: publish status per platform (draft / live / link) per episode

---

## Future ideas (not yet scoped)

- **Voice cloning** — user records 30s of their voice → ElevenLabs voice clone → episodes in their own voice
- **Co-host AI** — two-voice episodes with distinct personalities (closer to NotebookLM but branded)
- **Web dashboard** — standalone web app showing all episodes, analytics, publish history
- **Listener analytics** — Buzzsprout + YouTube + Instagram engagement stats in one view
- **Newsletter integration** — Substack, Beehiiv → Page2Podcast (same as Scouts but push, not pull)
- **RSS feed ingestion** — subscribe to any RSS feed → auto-generate episodes from new items
- **Transcript export** — formatted PDF / Notion page from generated script
- **Multi-language** — generate script and TTS in target language (Gemini + ElevenLabs both support this)

---

## Competitive context

| Competitor | Overlap | Gap vs. Page2Podcast |
|---|---|---|
| Google NotebookLM | Article → AI podcast | No extension, no brand customization, no publishing, no video |
| Wondercraft AI | Article → branded audio | No extension, no one-click flow, no video |
| Podcastle | AI podcast studio | Heavy DAW product, not a converter |
| ElevenLabs Reader | Webpage → audio | TTS reader only, not podcast narrative |
| Castmagic | Audio → show notes | Opposite direction |

**Defensible moat:** browsing-native (zero friction) + brand identity layer + full publishing pipeline + Scouts autonomous generation + video repurposing. No competitor does this chain end-to-end.

**HeyGen Seedance 2.0 note (Apr 2026):** HeyGen is a video generation tool, not a podcast tool — the opportunity is using their Avatar API as a rendering layer inside Page2Podcast, not competing with them. Their launch gives us a production-grade avatar engine without building one.

---

## Phase dependency map

```
Phase 1 ✅  Local storage persistence
    │
    ▼
Phase 2     Backend API + Auth          ← unlocks everything below
    ├──────────────┐
    ▼              ▼
Phase 3         Phase 4
Video render    Scouts integration
    │              │
    └──────┬───────┘
           ▼
        Phase 5
        Platform publishing
        (YouTube, Instagram)
```
