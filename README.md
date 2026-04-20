# Page2Podcast

> Convert any web page into a fully produced podcast episode — in one click.

**Page2Podcast** is a Chrome extension that reads the content of any article, blog post, or web page, uses Google Gemini AI to write a natural spoken-word podcast script, generates a full-length MP3 via OpenAI or ElevenLabs TTS, and publishes it directly to Buzzsprout (Spotify, Apple Podcasts, and 20+ platforms) — all without leaving your browser.

[**Install from Chrome Web Store →**](https://chromewebstore.google.com/detail/bjecbglodkapoclpgbgbdabemccfaepp)

---

## What it does

1. Open any article, blog post, or web page in Chrome
2. Click the **Page2Podcast** icon to open the side panel
3. Choose your episode format and click **Generate Script**
4. Review or edit the AI-written script
5. Click **Generate Audio** → full MP3 in seconds
6. Download your MP3 or publish directly to Buzzsprout → Spotify / Apple Podcasts

---

## Features

### AI Script Generation
- **Google Gemini AI** rewrites any page as a natural, spoken-word podcast episode — with hooks, transitions, and a conversational tone
- **5 episode formats** to match your content style:
  - Solo Deep-Dive — one host, thorough exploration
  - Interview Style — host + guest Q&A format
  - News Roundup — multiple stories, journalist tone
  - Narrative Storytelling — story arc with tension and resolution
  - Educational Tutorial — step-by-step teaching style
- **Podcast Identity** — define your show once, applied to every episode:
  - Podcast name, host name, show description
  - Category (Technology, Business, Health, Education, and more)
  - Target audience
  - Custom segments (e.g. "Cold open", "Main story", "Takeaways", "Sign-off")
- **Episode length** — Short (2–3 min), Medium (5–7 min), Long (8–10 min)
- **Tone** — Neutral, Educational, Casual, or Salesy

### Audio Generation
- **OpenAI TTS** (`gpt-4o-mini-tts`, `onyx` voice with podcast delivery instructions)
- **ElevenLabs TTS** (`eleven_turbo_v2_5` — any voice ID from the ElevenLabs library)
- Download MP3 directly to your device

### Buzzsprout Publishing
- Publish episodes directly to Buzzsprout from the extension
- Auto-fills title, description, and show notes
- Buzzsprout distributes to **Spotify, Apple Podcasts, Amazon Music, iHeart Radio**, and 20+ platforms via RSS
- Stores your Buzzsprout podcast ID and API token in Settings

### SEO & YouTube Metadata
Every episode generates a full SEO metadata panel alongside the script:
- **SEO title** — keyword-first, optimised for search
- **Alt titles** — 3 title variations to A/B test
- **YouTube chapters** — timestamped markers ready to paste into a YouTube video description
- **Tags** — comma-separated keyword tags for YouTube and podcast platforms
- **Thumbnail text** — short punchy text for video thumbnail overlays
- **Show notes** — keyword-rich paragraph for Buzzsprout / Spotify description and YouTube description
- One-click copy button for every field

### Yutori Scouts — Autonomous Content Monitoring
- Connect a **Yutori Scout** to monitor any topic (AI news, research papers, competitor updates, funding rounds…)
- Scout detects new content → Page2Podcast automatically generates a script + audio + Buzzsprout draft
- **Auto-generate toggle** — fully hands-off pipeline: episode is ready in your feed while you sleep
- **Chrome notification** when a new episode is auto-generated
- Configure scout query, cadence, and episode format per scout

### Episode History
- Full episode history persists across browser restarts (up to 100 entries)
- Revisit any past episode: view script, SEO metadata, regenerate audio
- Stored locally in `chrome.storage.local` — no account required

### Privacy-First
- All API keys stored locally in your Chrome profile via `chrome.storage.sync`
- Page content is sent directly from your browser to Google Gemini under **your own API key** — not through any server we operate
- No account required, no data collection

---

## Setup

### Install from Chrome Web Store

[**Page2Podcast on Chrome Web Store →**](https://chromewebstore.google.com/detail/bjecbglodkapoclpgbgbdabemccfaepp)

After installing, click the extension icon → open **Settings** and add your API keys.

### Install manually (developer mode)

1. Clone this repo
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → select this project folder
5. Click the Page2Podcast icon → side panel opens → go to **Settings**

---

## API Keys Required

| Provider | Used for | Get key |
|---|---|---|
| [Google Gemini](https://ai.google.dev) | Script generation | [ai.google.dev](https://ai.google.dev/gemini-api/docs/get-started) |
| [OpenAI](https://platform.openai.com) | Text-to-speech | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| [ElevenLabs](https://elevenlabs.io) | Text-to-speech (higher quality) | [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |
| [Buzzsprout](https://www.buzzsprout.com) | Podcast publishing | Buzzsprout → Account Settings → API |
| [Yutori](https://scouts.yutori.com) | Autonomous content scouting | scouts.yutori.com (early access) |

You need **Gemini + at least one TTS key**. Buzzsprout and Yutori are optional.

---

## Configuration

Open **Settings** (gear icon in the side panel):

| Setting | Description |
|---|---|
| Gemini API key | Required for script generation |
| OpenAI API key | Required if using OpenAI TTS |
| ElevenLabs API key + Voice ID | Required if using ElevenLabs TTS |
| TTS provider | Choose OpenAI or ElevenLabs |
| Buzzsprout API token + Podcast ID | Required for Buzzsprout publishing |
| Podcast name | Used in every script intro/outro |
| Host name | The AI writes as this host |
| Podcast description | Defines the show's voice and focus |
| Category | Podcast category (Technology, Business, etc.) |
| Target audience | Shapes tone and vocabulary |
| Episode format | Default format for new episodes |
| Custom segments | Optional segment list (e.g. Cold open, Takeaways) |
| Episode length | Short / Medium / Long |
| Tone | Neutral / Educational / Casual / Salesy |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Extension platform | Chrome Manifest V3 — side panel, service worker |
| Script generation | [Google Gemini API](https://ai.google.dev) (`gemini-2.5-flash`) |
| Text-to-speech | [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech) (`gpt-4o-mini-tts`) or [ElevenLabs](https://elevenlabs.io/docs/api-reference) (`eleven_turbo_v2_5`) |
| Podcast publishing | [Buzzsprout API](https://www.buzzsprout.com/api) |
| Content monitoring | [Yutori Scouts](https://scouts.yutori.com) |
| Storage | `chrome.storage.sync` (keys + prefs) · `chrome.storage.local` (episode history) |
| Build system | None — plain JS/HTML/CSS, load unpacked |

---

## Project Structure

```
page2podcast/
├── manifest.json        # Extension config and permissions
├── background.js        # Service worker: Gemini, TTS, Buzzsprout, Scouts pipeline
├── content.js           # Page content extraction (injected on demand)
├── popup.html/css/js    # Side panel UI
├── options.html/css/js  # Settings page
├── privacy.html         # Privacy policy
└── icons/               # Extension icons (16px, 48px, 128px)
```

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full product plan — video podcast generation (HeyGen), autonomous YouTube publishing, and more.

---

## Privacy

Page2Podcast collects no personal data. API keys are stored locally in your Chrome profile via `chrome.storage.sync`. Page content is sent directly from your browser to Google Gemini under your own API key — not through any server we operate. Generated audio is processed in your browser and downloaded to your device.

[Full privacy policy →](https://vikashsparxit.github.io/page2podcast/privacy.html)

---

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

---

## License

[MIT](LICENSE)
