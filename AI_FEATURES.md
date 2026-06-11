# Page2Podcast — AI Features Overview

A summary of every AI-powered feature in the extension, what it does, and which models power it.

---

## 1. Podcast Script Generation

**What it does:** Takes the extracted text of any web page and rewrites it as a fully produced, spoken-word podcast script — with a cold open, structured body, and sign-off.

**Models used:**
- Gemini 2.5 Flash (primary — fast, cost-efficient)
- Gemini 2.5 Pro (fallback if Flash is overloaded)
- GPT-4o (final fallback if both Gemini models are unavailable)

**Key behaviours:**
- Applies Podcast Identity (name, host, description, category, audience) as a lens over every sentence
- Respects episode length target (Short / Medium / Long → word budget)
- Respects tone setting (Neutral / Educational / Casual / Salesy)
- Honours source fidelity: if the source mentions a specific company or model, the script does not substitute another

---

## 2. Episode Format Engine

**What it does:** Shapes the script structure and narrative voice based on the selected episode format. Each format has a different persona, structure, and language register.

**5 formats available:**
| Format | Voice / Structure |
|---|---|
| Solo Deep-Dive | Host explores the topic as themselves — analysis and perspective |
| Interview Style | Host interviews an imagined expert drawn from the source content |
| News Roundup | Smart, opinionated anchor presenting multiple stories |
| Narrative Storytelling | Storyteller building tension and landing a lesson |
| Educational Tutorial | Knowledgeable friend walking through something step by step |

**Model:** Same as script generation — format guidance is injected into the prompt before the LLM call.

---

## 3. Episode Template Mode

**What it does:** When a custom episode template is saved in Settings, the LLM is instructed to follow it exactly — segment by segment, with word budgets per section. Overrides the default format engine.

**How it works:** The template text is embedded directly into the prompt with the instruction to treat each segment as a hard structural constraint. The LLM outputs a `--- SCRIPT ---` block followed by a `--- METADATA ---` block.

**Use case:** Power users who have a fixed show format (e.g. cold open → headlines → deep dive → takeaway → close) and want every episode to match it precisely.

---

## 4. SEO Metadata Generation

**What it does:** Automatically generates a full suite of SEO and publishing metadata alongside every script — no second prompt needed from the user.

**Fields generated:**
| Field | Description |
|---|---|
| SEO Title | Keyword-first episode title, 60 chars max |
| Alt Titles | 3 title variations for A/B testing |
| YouTube Chapters | Timestamped chapter markers for YouTube description |
| Tags | Comma-separated keyword tags for YouTube and podcast platforms |
| Thumbnail Text | Short punchy text for video thumbnail overlays |
| Show Notes | 150–200 word keyword-rich paragraph for Buzzsprout / Apple / Spotify |

**Model:** Gemini 2.5 Flash → Gemini 2.5 Pro → GPT-4o (same cascade as script generation). Metadata is parsed from the `--- METADATA ---` block appended to the LLM output.

---

## 5. Episode Title & Description Generation

**What it does:** After script generation, a separate LLM call generates a clean episode title and short description for use in Buzzsprout publishing — distinct from the SEO metadata.

**Model:** Gemini 2.5 Flash → Gemini 2.5 Pro → GPT-4o.

**Output:** Title (used as Buzzsprout episode title) + description (used as show notes in the Buzzsprout draft).

---

## 6. Text-to-Speech Audio Generation

**What it does:** Converts the generated (or user-edited) script into a full-length MP3 audio file.

**Two providers (user-configurable):**
| Provider | Model | Notes |
|---|---|---|
| OpenAI TTS | `gpt-4o-mini-tts` | `onyx` voice, podcast delivery instructions injected |
| ElevenLabs | `eleven_turbo_v2_5` | Any voice ID from the ElevenLabs library |

**How it works:** The script is sent to the chosen TTS API; the returned audio is assembled in the browser and offered as an MP3 download or sent directly to Buzzsprout.

---

## 7. Yutori Scouts — Autonomous Content Monitoring

**What it does:** Connects the extension to a Yutori Scout — an AI agent that continuously monitors any topic on the web. When the Scout publishes a new update, Page2Podcast can automatically generate a script, audio, and Buzzsprout draft without any manual input.

**How it works:**
- User configures a Scout query and interval (e.g. daily AI news digest)
- Yutori's platform runs the scout and publishes structured research updates
- Page2Podcast polls for new updates on a background alarm
- On a new update: Gemini generates the script → ElevenLabs generates audio → Buzzsprout draft is created
- Chrome notification fires when the episode is ready

**Auto-generate toggle:** When enabled, the full pipeline runs hands-off. When disabled, the user triggers generation manually from the Scouts tab.

**Model:** Same script generation cascade (Gemini 2.5 Flash → Pro → GPT-4o).

---

## 8. Podcast Identity — AI Persona Layer

**What it does:** Every LLM call is personalised by the user's configured Podcast Identity. This is not a separate AI feature — it is a conditioning layer applied across all script generation.

**Fields that influence the LLM:**
- **Podcast name** — used in intro/outro
- **Host name** — the AI writes as this person
- **Show description** — every sentence is evaluated against this promise; anything off-topic is cut
- **Category** — shapes vocabulary and framing
- **Target audience** — pitch level and assumed knowledge
- **Custom segments** — named structural sections the LLM must include
- **Sponsor line** — injected naturally into the script if set

---

## 9. Page Content Extraction

**What it does:** Extracts the meaningful text from any web page before it is sent to the LLM — strips nav, ads, footers, and boilerplate.

**How it works:** `content.js` is injected into the active tab on demand. It walks the DOM, scores text nodes by density and position, and returns a cleaned content string. This is rule-based (not LLM-powered), but it is the first step in the AI pipeline.

---

## Model / Provider Summary

| Capability | Primary | Fallback 1 | Fallback 2 |
|---|---|---|---|
| Script generation | Gemini 2.5 Flash | Gemini 2.5 Pro | GPT-4o |
| SEO metadata | Gemini 2.5 Flash | Gemini 2.5 Pro | GPT-4o |
| Episode title/description | Gemini 2.5 Flash | Gemini 2.5 Pro | GPT-4o |
| Text-to-speech | OpenAI `gpt-4o-mini-tts` | ElevenLabs `eleven_turbo_v2_5` | — |
| Content monitoring | Yutori Scouts platform | — | — |
