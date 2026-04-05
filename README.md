# Page2Podcast

> Convert any web page into a podcast-style MP3 — in one click.

**Page2Podcast** is a Chrome extension that reads the content of any article, blog post, or web page, uses Google Gemini AI to write a natural spoken-word podcast script, then generates a full-length MP3 audio file using OpenAI or ElevenLabs text-to-speech. The result downloads straight to your device.

---

## How it works

1. Open any article or web page in Chrome
2. Click the **Page2Podcast** icon in your toolbar to open the side panel
3. Click **Generate Podcast Audio**
4. The extension extracts the page text → writes a conversational podcast script via Gemini AI → synthesises speech via your chosen TTS provider
5. Review or edit the script, then click **Generate Audio**
6. Download your MP3 and listen anywhere

---

## Features

- **Side panel UI** — stays open alongside the page, no popup overlay
- **AI-written scripts** — Gemini AI rewrites page content as a natural, spoken-word podcast episode with hooks, transitions, and a conversational tone
- **High-quality TTS** — OpenAI TTS (`onyx` voice with podcast delivery instructions) or ElevenLabs (any voice ID, `eleven_turbo_v2_5` model)
- **Script editor** — review and edit the generated script before converting to audio
- **Inline settings** — configure API keys and preferences without leaving the panel
- **Episode history** — revisit and re-generate audio for recent episodes in this session
- **Configurable** — podcast name, host name, episode length (2–10 min), tone (neutral / educational / casual / salesy), TTS provider and voice
- **Privacy-first** — all API keys stored locally in Chrome, never sent to any server we control

---

## Setup

### Prerequisites

You need API keys from at least two providers:

| Provider | Used for | Get key |
|---|---|---|
| [Google Gemini](https://ai.google.dev) | Script generation | [ai.google.dev](https://ai.google.dev/gemini-api/docs/get-started) |
| [OpenAI](https://platform.openai.com) | Text-to-speech (recommended) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| [ElevenLabs](https://elevenlabs.io) | Text-to-speech (best quality) | [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |

You need **Gemini + at least one TTS key** (OpenAI or ElevenLabs).

### Install from Chrome Web Store

> Currently under review — link will be added on approval.

### Install manually (developer mode)

1. Clone or download this repo
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** → select this project folder
5. Click the Page2Podcast icon in your toolbar → side panel opens → go to **Settings** and add your API keys

---

## Configuration

Open the **Settings** panel (gear icon in the top-right of the side panel):

| Setting | Description |
|---|---|
| **Gemini API key** | Required for script generation |
| **OpenAI API key** | Required if using OpenAI TTS |
| **ElevenLabs API key** | Required if using ElevenLabs TTS |
| **ElevenLabs voice ID** | Optional — paste any voice ID from the ElevenLabs voice library |
| **TTS provider** | OpenAI or ElevenLabs |
| **Podcast name** | Used in the script intro and outro |
| **Host name** | The host name the AI writes as |
| **Episode length** | Short (2–3 min) / Medium (5–7 min) / Long (8–10 min) |
| **Tone** | Neutral / Educational / Casual / Salesy |

All settings are stored locally using `chrome.storage.sync` — synced across your Chrome profile, never sent to any server we control.

---

## Tech stack

| Layer | Technology |
|---|---|
| Extension platform | Chrome Manifest V3 — side panel, service worker |
| Script generation | [Google Gemini API](https://ai.google.dev) (`gemini-2.5-flash`) |
| Text-to-speech | [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech) (`gpt-4o-mini-tts`) or [ElevenLabs](https://elevenlabs.io/docs/api-reference) (`eleven_turbo_v2_5`) |
| Storage | `chrome.storage.sync` (keys + prefs) · `chrome.storage.session` (history) |
| Build system | None — plain JS/HTML/CSS, load unpacked |

---

## Project structure

```
page2podcast/
├── manifest.json        # Extension config and permissions
├── background.js        # Service worker: Gemini + TTS API calls
├── content.js           # Page content extraction (injected on demand)
├── popup.html/css/js    # Side panel UI
├── options.html/css/js  # Settings page
├── privacy.html         # Privacy policy
└── icons/               # Extension icons (16px, 48px, 128px)
```

---

## Privacy

Page2Podcast collects no personal data. API keys are stored locally in your Chrome profile via `chrome.storage.sync`. Page content is sent directly from your browser to Google Gemini under your own API key — not through any server we operate. Generated audio is processed in the browser and downloaded to your device.

[Full privacy policy →](https://vikashsparxit.github.io/page2podcast/privacy.html)

---

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

---

## License

MIT
