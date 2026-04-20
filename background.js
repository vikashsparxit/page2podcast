// Open the side panel whenever the toolbar icon is clicked.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

async function getStoredKeys() {
  const { geminiApiKey, ttsApiKey, openAiApiKey, ttsProvider, anthropicApiKey } =
    await chrome.storage.sync.get([
      "geminiApiKey", "ttsApiKey", "openAiApiKey", "ttsProvider", "anthropicApiKey"
    ]);
  return { geminiApiKey, ttsApiKey, openAiApiKey, ttsProvider, anthropicApiKey };
}

async function addHistoryEntry(entry) {
  const { podcastHistory = [] } = await chrome.storage.local.get([
    "podcastHistory"
  ]);
  const next = [entry, ...podcastHistory];
  // keep the most recent 100 entries; scripts avg ~3KB so this stays well under 5MB
  await chrome.storage.local.set({
    podcastHistory: next.slice(0, 100)
  });
}

// Sync a generated episode to the Page2Podcast web app (fire-and-forget).
// Uses a shared API secret stored in extension settings.
// Fails silently — the extension works without the web app being configured.
async function syncEpisodeToWebApp(entry) {
  try {
    const { webAppApiSecret, webAppUrl } = await chrome.storage.sync.get([
      "webAppApiSecret", "webAppUrl"
    ]);
    if (!webAppApiSecret || !webAppUrl) return; // not configured — skip silently

    const baseUrl = webAppUrl.replace(/\/$/, "");
    await fetch(`${baseUrl}/api/episodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${webAppApiSecret}`,
      },
      body: JSON.stringify({
        extension_id:          entry.id,
        title:                 entry.title,
        page_url:              entry.url || null,
        script:                entry.script || null,
        description:           entry.episodeDescription || null,
        seo_meta:              entry.seoMeta || null,
        source:                entry.source || "generate",
        buzzsprout_episode_id: entry.buzzsproutEpisodeId || null,
        created_at:            entry.createdAt,
      }),
    });
  } catch (_) {
    // Network error or web app not reachable — extension keeps working fine
  }
}

function mapToneToDescription(tone) {
  switch (tone) {
    case "educational":
      return "clear, structured, and educational, like a great teacher.";
    case "salesy":
      return "energetic, persuasive, and benefit-focused, but never spammy.";
    case "casual":
      return "friendly, relaxed, and conversational, like talking to a smart friend.";
    case "neutral":
    default:
      return "balanced, calm, and neutral while still being engaging.";
  }
}

function mapLengthToDuration(targetLength) {
  switch (targetLength) {
    case "short":
      return "2–3 minutes. MINIMUM 300 words, TARGET 400 words. Write every sentence fully — no bullet summaries, no truncating.";
    case "medium":
      return "5–7 minutes. MINIMUM 650 words, TARGET 900 words. Every segment must be fully developed — no placeholders, no compressed ideas.";
    case "long":
      return "8–10 minutes. MINIMUM 1,050 words, TARGET 1,300 words. Each segment must be fully expanded. If a segment feels thin, add a concrete example, analogy, or builder implication. Do NOT finish early.";
    case "extralong":
      return "12–15 minutes. MINIMUM 1,600 words, TARGET 2,000 words. This is a full-length episode — write every segment completely. Expand every idea with examples, analogies, and context. Do NOT summarise or compress. If a segment feels thin, go deeper. Do NOT finish early.";
    default:
      return "8–10 minutes. MINIMUM 1,050 words, TARGET 1,300 words. Each segment must be fully expanded. Do NOT finish early.";
  }
}

function inferPageTypeHint(url) {
  if (!url) return "This looks like an article or blog post.";
  const lower = url.toLowerCase();
  if (
    lower.includes("services") ||
    lower.includes("service") ||
    lower.includes("solutions") ||
    lower.includes("pricing")
  ) {
    return "This looks like a service or landing page describing offerings for potential customers.";
  }
  return "This looks like an article or blog post.";
}

function mapFormatToGuidance(format, podcastName, hostName, customSegments) {
  const welcome = `"Welcome to ${podcastName}, I’m ${hostName}…"`;

  if (customSegments && customSegments.trim()) {
    const segments = customSegments.split("→").map(s => s.trim()).filter(Boolean);
    return `EPISODE STRUCTURE (follow these segments in order, no labels in output):
${segments.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

Flow between segments naturally. Never announce segment names out loud.`;
  }

  switch (format) {
    case "interview":
      return `EPISODE FORMAT: Interview style — you are the host interviewing an imagined expert whose knowledge comes entirely from the source content.
EPISODE STRUCTURE:
  1. Hook — a provocative statement or question, no names yet
  2. Welcome — ${welcome} — introduce your guest as an expert on this topic
  3. Interview — 4–6 questions with the host asking and then voicing the expert’s answer; keep answers conversational, never robotic
  4. Host reflection — step back and share your personal takeaway from the conversation
  5. Listener challenge — one thing the listener should try or think about this week
  6. Sign-off — warm close, tease next episode concept vaguely

Host voice and expert voice must feel distinct. Host is curious and warm. Expert is confident and specific.`;

    case "news":
      return `EPISODE FORMAT: News roundup — you are a smart, opinionated anchor presenting the key story or stories from the source.
EPISODE STRUCTURE:
  1. Cold open — one arresting sentence about the biggest story
  2. Welcome — ${welcome} — this is your briefing for [topic area]
  3. Main story — the core news item with context: what happened, why it matters, what comes next
  4. Ripple effects — 2–3 connected angles or implications (woven conversationally, not a list)
  5. What to watch — one thing to keep an eye on in the coming days/weeks
  6. Quick close — sharp, punchy sign-off, under 3 sentences

Be opinionated but fair. Give context that a busy person would miss. Move fast.`;

    case "story":
      return `EPISODE FORMAT: Narrative storytelling — you’re a storyteller drawing the listener into a scene, building tension, and landing a lesson.
EPISODE STRUCTURE:
  1. Scene-setter — drop the listener into a moment or place, present tense if possible ("It’s a Tuesday morning in…")
  2. Welcome — ${welcome} — tell them this episode is a story about [theme]
  3. Rising action — build the narrative with specific details, real stakes, a turning point
  4. The lesson — the insight the story unlocks, told conversationally not as a moral
  5. Reflection — why this story matters to YOU and why you’re sharing it
  6. Close — an invitation: "I want you to think about…" or a question to sit with

Use sensory detail, specific names/numbers, and pacing. No vague summaries — make it feel real.`;

    case "tutorial":
      return `EPISODE FORMAT: Educational tutorial — you are a knowledgeable friend walking the listener through something step by step.
EPISODE STRUCTURE:
  1. Problem hook — start with the pain or confusion this episode solves
  2. Welcome — ${welcome} — frame today’s episode as a practical guide to [topic]
  3. Why it matters — briefly, compellingly, explain the stakes of understanding this
  4. The core explanation — break it down clearly; use analogies and concrete examples; anticipate confusion points
  5. Common mistakes — 2–3 pitfalls people fall into (woven naturally, not as a list)
  6. Key takeaways — 3–5 things to remember, said naturally as parting thoughts
  7. Close — encourage the listener, tell them what to try first

Speak at the level of a smart beginner. Never condescend. Never over-qualify.`;

    case "solo":
    default:
      return `EPISODE FORMAT: Solo deep-dive — you explore and unpack the topic as yourself, sharing your perspective and analysis.
EPISODE STRUCTURE:
  1. Hook — a bold statement or question, no intro yet, just grab them
  2. Welcome — ${welcome} — set up what this episode explores and why it matters now
  3. Deep dive — 3–4 core ideas from the content; each backed with an example, analogy, or story; transition naturally between them
  4. Takeaways — 3–5 things the listener can think or do differently, spoken naturally
  5. Close — warm wrap-up, genuine personal sign-off`;
  }
}

// ── LLM call helpers ─────────────────────────────────────────────

async function callClaude(anthropicKey, prompt) {
  if (!anthropicKey) throw new Error("Missing Anthropic API key. Add it in Settings.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!res.ok) {
    let details = "";
    try {
      const body = await res.json();
      const msg = body.error?.message || body.message;
      if (msg) details = " – " + msg;
    } catch (_) {}
    const err = new Error("Claude API error: " + res.status + details);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data.content?.[0]?.text?.trim() || "";
}

// Route a prompt to the model the user selected.
async function callSelectedModel(model, keys, prompt) {
  const { geminiApiKey, openAiApiKey, anthropicApiKey } = keys;
  const label = {
    "gemini-2.5-flash": "Gemini 2.5 Flash",
    "gemini-2.5-pro":   "Gemini 2.5 Pro",
    "gpt-4o":           "GPT-4o",
    "claude-sonnet-4-5":"Claude Sonnet"
  }[model] || model;

  broadcastStatus(`Writing script with ${label}…`);

  if (model === "gpt-4o")            return callOpenAI(openAiApiKey, prompt);
  if (model === "claude-sonnet-4-5") return callClaude(anthropicApiKey, prompt);
  // Gemini models
  return callGemini(geminiApiKey, prompt, model);
}

const GEMINI_PRIMARY = "gemini-2.5-flash";

async function callGemini(apiKey, prompt, model) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" +
    encodeURIComponent(apiKey);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) {
    let details = "";
    try {
      const body = await res.json();
      const msg = body.error?.message || body.message;
      if (msg) details = " – " + msg;
    } catch (_) {}
    const err = new Error("Gemini API error: " + res.status + details);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim() || "";
}

async function callOpenAI(openAiKey, prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + openAiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!res.ok) {
    let details = "";
    try {
      const body = await res.json();
      const msg = body.error?.message || body.message;
      if (msg) details = " – " + msg;
    } catch (_) {}
    throw new Error("OpenAI API error: " + res.status + details);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

function broadcastStatus(message) {
  chrome.runtime.sendMessage({ type: "STATUS_UPDATE", message }).catch(() => {});
}

// Script generation: use whatever model the user selected, retry once on transient errors.
async function callLLMForScript(model, keys, prompt) {
  const MAX_ATTEMPTS = 2;
  const RETRY_DELAY_MS = 4000;

  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      if (attempt > 1) broadcastStatus("Server busy — retrying…");
      const result = await callSelectedModel(model, keys, prompt);
      if (result) return result;
    } catch (err) {
      lastErr = err;
      const isTransient = err.status === 503 || err.status === 429 ||
        /503|429|overloaded|high demand/i.test(err.message);
      if (!isTransient) throw err; // auth/bad request — fail immediately
      if (attempt < MAX_ATTEMPTS) {
        broadcastStatus("Server busy — retrying in 4s…");
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }
  throw new Error(
    (lastErr?.message || "Generation failed") +
    " — try again in a moment, or switch to a different model."
  );
}

// For metadata (title/description): flash → pro → OpenAI. Low hallucination risk so OpenAI is fine last resort.
async function callLLM(geminiKey, openAiKey, prompt) {
  if (geminiKey) {
    for (const model of ["gemini-2.5-flash", "gemini-2.5-pro"]) {
      try {
        const result = await callGemini(geminiKey, prompt, model);
        if (result) return result;
      } catch (err) {
        const isTransient = err.status === 503 || err.status === 429 ||
          /503|429|overloaded|high demand/i.test(err.message);
        if (!isTransient) break;
        console.warn(`${model} overloaded for metadata, escalating…`);
      }
    }
    console.warn("All Gemini models busy for metadata, falling back to OpenAI.");
  }
  if (!openAiKey) throw new Error("Gemini is unavailable and no OpenAI key is configured. Add an OpenAI key in Settings.");
  return callOpenAI(openAiKey, prompt);
}

async function buildScriptPrompt(title, clippedText, pageUrl) {
  const {
    targetLength, tone, podcastName, hostName,
    podcastDescription, podcastCategory, episodeFormat,
    targetAudience, customSegments, episodeTemplate, sponsorLine
  } = await chrome.storage.sync.get([
    "targetLength", "tone", "podcastName", "hostName",
    "podcastDescription", "podcastCategory", "episodeFormat",
    "targetAudience", "customSegments", "episodeTemplate", "sponsorLine"
  ]);

  const toneDescription = mapToneToDescription(tone);
  const targetDuration  = mapLengthToDuration(targetLength);
  const pageTypeHint    = inferPageTypeHint(pageUrl);

  const safePodcastName = podcastName || "Page2Podcast";
  const safeHostName    = hostName    || "your host";
  const safeFormat      = episodeFormat || "solo";

  const sponsorInstruction = sponsorLine
    ? `SPONSOR (read this VERBATIM in the welcome/intro — do not rephrase, summarise, or add to it):
"${safePodcastName}, brought to you by ${sponsorLine} — welcome back, I’m your host, ${safeHostName}."
Use this exact line as your show intro. Replace any generic welcome line with it.`
    : "";

  const identityLines = [];
  if (podcastDescription) identityLines.push(`Show promise: "${podcastDescription}" — every point must earn its place against this promise. Cut anything that doesn’t serve it.`);
  if (podcastCategory)    identityLines.push(`Genre: ${podcastCategory}`);
  if (targetAudience)     identityLines.push(`Audience: ${targetAudience} — pitch every idea at the right level for these listeners, no lower, no higher`);
  const identityBlock = identityLines.length
    ? `SHOW IDENTITY (apply this lens to every single sentence):\n${identityLines.map(l => "• " + l).join("\n")}`
    : "";

  const SPEECH_RULES = `══════════════════════════════════════════
THIS IS AUDIO. THE LISTENER CANNOT SEE ANYTHING.
WRITE EXACTLY WHAT YOU WOULD SAY INTO A MICROPHONE.
══════════════════════════════════════════

⚠ CONTENT GROUNDING — ABSOLUTE RULE — NEVER VIOLATE THIS:
Every company name, product name, person, statistic, event, and factual claim you write
MUST come from the Source Material below. Do NOT invent, substitute, or hallucinate ANY
information. If the source says Anthropic and Claude Mythos — that is what you cover.
Do not replace it with OpenAI, Google, or any other company not in the source.
The Source Material IS the episode content. Your job is to transform it into compelling
spoken audio — not to replace it with generic or made-up AI news.

MANDATORY SPEECH RULES — violating any of these is a failure:

1. CONTRACTIONS EVERYWHERE. Never: "I am", "it is", "do not", "we are", "that is".
   Always: "I’m", "it’s", "don’t", "we’re", "that’s". No exceptions.

2. SENTENCE RHYTHM — mix very short sentences with longer flowing ones.
   Bad: "AI agents are autonomous systems that can perform tasks."
   Good: "AI agents act on their own. They don’t wait to be told. They just... go."

3. PAUSES & BREATH — use ellipses (...) for dramatic pauses and em-dashes (—) for
   natural speech breaks mid-sentence. "And here’s the thing — nobody saw this coming."

4. HOST REACTIONS — "I mean, think about that for a second.", "Wild, right?", "That’s the part that got me."

5. RHETORICAL QUESTIONS — every 2–3 paragraphs: "So what does this mean for you?", "Sound familiar?"

6. NATURAL CONNECTORS — And, But, So, Because, Now, Look, Here’s the thing.
   BANNED: Furthermore, Moreover, Additionally, In conclusion, In summary, Notably.

7. NEVER say: "this article", "this page", "this content", "as mentioned", "the author".`;

  const sourceBlock = `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
SOURCE MATERIAL — READ THIS FIRST.
THIS IS THE ONLY CONTENT FOR THIS EPISODE.
Topic: ${title}

${clippedText}
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`;

  // ── TEMPLATE MODE ──────────────────────────────────────────────
  if (episodeTemplate && episodeTemplate.trim()) {
    return `${sourceBlock}

STEP 1 — Before writing a single word of script, silently list every company, product, and key claim in the Source Material above. You may ONLY use those names and facts. Any company or product not listed in the Source Material is FORBIDDEN.

STEP 2 — Write the full podcast script as ${safeHostName}, host of "${safePodcastName}".
${identityBlock ? "\n" + identityBlock : ""}
${sponsorInstruction ? "\n" + sponsorInstruction : ""}

${SPEECH_RULES}

TONE: ${toneDescription}

⏱ LENGTH REQUIREMENT — THIS IS MANDATORY:
TARGET: ${targetDuration}
You MUST write enough to hit the minimum word count. Go segment by segment — if you finish a segment and the total is still short, expand that segment with more examples, analogies, or builder implications before moving on. Do NOT end the script early. A short script is a failed script.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPISODE TEMPLATE — follow this structure exactly. Each segment has a word budget — hit it:

${episodeTemplate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBSCRIBE PROMPT (insert naturally between the deep dive and the final takeaway — do NOT skip this):
"If you're finding this useful, hit follow in your podcast app right now — it takes two seconds and it's the best way to make sure you don't miss the next briefing."
Read this aloud exactly as written. It must appear as a spoken sentence in the script.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEYWORD GROUNDING RULE (applies to cold open + headline sentences):
The very first sentence of the episode AND the first sentence of each headline MUST naturally include the primary topic keyword — the main company name, product name, or core concept from the source. This is what podcast search engines and YouTube index first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT:
Produce TWO clearly separated sections:

--- SCRIPT ---
The full spoken script — plain text only, no segment labels, no headers, no brackets.
Every sentence must trace back to a specific fact from the Source Material above.

--- METADATA ---
Return exactly this block (fill in each field — no placeholders):

SEO_TITLE: [keyword-first episode title, 60 chars max, e.g. "Claude 4 vs GPT-5: What Builders Need to Know"]
ALT_TITLE_1: [alternative title for A/B testing]
ALT_TITLE_2: [another alternative]
YOUTUBE_DESC_LINE1: [first line of YouTube description — front-load the main keyword, mention the show name]
YOUTUBE_DESC_LINE2: [second line — one concrete thing the viewer will learn]
CHAPTERS:
0:00 — Cold open
0:45 — Show intro
1:00 — [headline 1 topic from source]
[continue for each major section, approximate times]
TAGS: [10–15 comma-separated tags, mix broad (AI news, AI for builders) and specific (topic keyword, company names from source)]
THUMBNAIL_TEXT: [7 words max, punchy, no fluff — what goes on the video thumbnail]
SHOW_NOTES: [150–200 words, keyword-rich paragraph for Buzzsprout/Apple — include episode topic, key companies/products mentioned, one concrete takeaway, and a CTA to follow the show]`;
  }

  // ── STANDARD MODE ─────────────────────────────────────────────
  const formatGuidance = mapFormatToGuidance(safeFormat, safePodcastName, safeHostName, customSegments);

  return `${sourceBlock}

STEP 1 — Before writing a single word of script, silently list every company, product, and key claim in the Source Material above. You may ONLY use those names and facts. Any company or product not listed in the Source Material is FORBIDDEN.

STEP 2 — Write the full podcast script as ${safeHostName}, host of "${safePodcastName}".
${identityBlock ? "\n" + identityBlock + "\n" : ""}${sponsorInstruction ? "\n" + sponsorInstruction + "\n" : ""}
${SPEECH_RULES}

7. NO LISTS. Never "First... Second... Third..." — weave ideas together conversationally.

8. NEVER say: "this article", "this page", "this content", "as mentioned", "as stated", "the author".

TONE: ${toneDescription}
PAGE TYPE: ${pageTypeHint}

⏱ LENGTH REQUIREMENT — THIS IS MANDATORY:
TARGET: ${targetDuration}
You MUST write enough to hit the minimum word count. If you finish a section and are still short, expand with more examples, analogies, or builder implications. Do NOT end the script early. A short script is a failed script.

${formatGuidance}

OUTPUT: The script only — plain spoken text, no headers, labels, brackets.
Every sentence must trace back to a specific fact from the Source Material above.`;
}

// Returns { script, rawOutput } — script is the spoken text only, rawOutput includes the metadata block.
async function generatePodcastScript(model, keys, title, text, pageUrl) {
  const maxInput = 16000;
  const clippedText = (text || "").slice(0, maxInput);

  if (!clippedText.trim()) throw new Error("No content detected on this page.");

  const prompt = await buildScriptPrompt(title, clippedText, pageUrl);
  const raw    = await callLLMForScript(model, keys, prompt);

  if (!raw) throw new Error("The AI returned an empty script. Try again.");

  const { scriptText } = splitScriptAndMeta(raw);
  return { script: scriptText || raw, rawOutput: raw };
}

// Parse the --- METADATA --- block that the script prompt now appends.
// Returns { title, description, seoMeta } or null if block is absent.
function parseMetadataBlock(raw) {
  const metaIdx = raw.indexOf("--- METADATA ---");
  if (metaIdx === -1) return null;
  const block = raw.slice(metaIdx + "--- METADATA ---".length).trim();

  const field = (key) => {
    const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return match ? match[1].trim() : "";
  };

  const chaptersMatch = block.match(/^CHAPTERS:\n([\s\S]*?)(?=\nTAGS:|$)/m);
  const chapters = chaptersMatch ? chaptersMatch[1].trim() : "";

  const tagsMatch = block.match(/^TAGS:\s*(.+)$/m);
  const tags = tagsMatch ? tagsMatch[1].trim() : "";

  const showNotesMatch = block.match(/^SHOW_NOTES:\s*([\s\S]+)$/m);
  const showNotes = showNotesMatch ? showNotesMatch[1].trim() : "";

  const title = field("SEO_TITLE");
  const description = showNotes || field("YOUTUBE_DESC_LINE1") + " " + field("YOUTUBE_DESC_LINE2");

  if (!title && !description) return null;

  return {
    title,
    description,
    seoMeta: {
      altTitles: [field("ALT_TITLE_1"), field("ALT_TITLE_2")].filter(Boolean),
      youtubeDescLine1: field("YOUTUBE_DESC_LINE1"),
      youtubeDescLine2: field("YOUTUBE_DESC_LINE2"),
      chapters,
      tags,
      thumbnailText: field("THUMBNAIL_TEXT"),
      showNotes,
    }
  };
}

// Split raw LLM output into script text + metadata (if present).
function splitScriptAndMeta(raw) {
  const scriptIdx = raw.indexOf("--- SCRIPT ---");
  const metaIdx   = raw.indexOf("--- METADATA ---");

  if (scriptIdx === -1) {
    // Old format — no delimiters — return raw as script
    return { scriptText: raw, metaBlock: null };
  }

  const scriptText = metaIdx === -1
    ? raw.slice(scriptIdx + "--- SCRIPT ---".length).trim()
    : raw.slice(scriptIdx + "--- SCRIPT ---".length, metaIdx).trim();

  const metaBlock = metaIdx !== -1 ? raw.slice(metaIdx) : null;

  return { scriptText, metaBlock };
}

async function generateEpisodeMeta(geminiKey, openAiKey, script) {
  // First try: parse embedded metadata block produced by template-mode prompt
  const embedded = parseMetadataBlock(script);
  if (embedded) return embedded;

  // Fallback: call LLM to generate SEO-rich metadata from the script
  const prompt = `You are writing SEO-optimised metadata for a podcast episode. Based on the script below, generate a keyword-rich title and show notes.

TITLE rules:
- 60 characters max
- Keyword-first — lead with the main company name, product, or topic from the episode
- Specific and benefit-driven — what will the listener actually learn?
- No "Episode X:" prefix, no quotes
- Bad: "Exploring AI Agents and Their Impact on Modern Technology"
- Good: "Claude 4 vs GPT-5: What Builders Need to Know"

DESCRIPTION rules (used as podcast show notes — 150–200 words):
- Paragraph format, NOT bullets
- Open with the main keyword and what happened
- Include key companies, products, and concepts mentioned in the episode (for search indexing)
- One concrete takeaway the listener will get
- Close with a CTA: "Follow No-BS AI Briefing in your podcast app so you don't miss the next one."
- Written for Buzzsprout/Apple Podcasts — what a listener sees before hitting play

Return ONLY valid JSON, no markdown, no explanation:
{"title": "...", "description": "..."}

Script (first 3000 chars):
${script.slice(0, 3000)}`;

  try {
    const raw = await callLLM(geminiKey, openAiKey, prompt);
    const cleaned = raw.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  } catch (_) {
    return null;
  }
}

async function generateTtsAudioElevenLabs(ttsKey, text) {
  if (!ttsKey) {
    throw new Error("Missing ElevenLabs API key. Add it in Settings.");
  }
  let trimmed = (text || "").trim();
  if (!trimmed) {
    throw new Error("TTS input script is empty.");
  }

  // Clean script for TTS: remove structural labels and inline markers that should not be spoken.
  trimmed = trimmed
    // remove standalone lines that are just labels in parentheses
    .replace(/^\s*\([^)]*\)\s*$/gm, "")
    // remove leading labels in parentheses at the start of a line
    .replace(/^\s*\([^)]*\)\s*/gm, "")
    // remove simple inline beat/emphasis markers
    .replace(/\[beat\]/gi, "")
    .replace(/\[\/?emphasis\]/gi, "")
    .trim();

  const { elevenVoiceId } = await chrome.storage.sync.get(["elevenVoiceId"]);
  // Default: "Vikram" — Indian-English male voice (warm, clear, podcast-ready).
  // To change: go to elevenlabs.io/voice-library → filter by Indian/South Asian accent
  // → open any voice → copy Voice ID → paste into Settings > ElevenLabs voice ID.
  const voiceId = elevenVoiceId || "rx0BnY6ArVuCFVFiRjlR";

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ttsKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg"
      },
      body: JSON.stringify({
        text: trimmed,
        // eleven_turbo_v2_5 — best expressiveness for long-form content
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.38,          // lower = more dynamic, varied delivery
          similarity_boost: 0.78,   // keep it true to the voice
          style: 0.62,              // more stylistic expression
          use_speaker_boost: true   // cleaner, crispier voice
        }
      })
    }
  );

  if (!res.ok) {
    let details = "";
    try {
      const body = await res.json();
      const raw =
        body.error || body.message || body.detail || body || undefined;
      const msg =
        typeof raw === "string" ? raw : JSON.stringify(raw, null, 2);
      if (msg) {
        details = " – " + msg;
      }
    } catch (e) {
      // ignore parse errors, fall back to status only
    }
    throw new Error("ElevenLabs TTS API error: " + res.status + details);
  }

  const contentType = res.headers.get("content-type") || "";

  // If ElevenLabs ever returns JSON (e.g. an error payload with 200),
  // surface that to the UI instead of passing through as a tiny \"audio\" blob.
  if (contentType.includes("application/json")) {
    try {
      const json = await res.json();
      const msg =
        json.error?.message ||
        json.detail ||
        json.message ||
        "Unexpected JSON response from ElevenLabs.";
      throw new Error("ElevenLabs TTS error: " + msg);
    } catch (e) {
      throw new Error("ElevenLabs TTS error: received JSON instead of audio.");
    }
  }

  const blob = await res.blob();
  if (blob.size < 1024) {
    try {
      const textPreview = await blob.text();
      throw new Error(
        "ElevenLabs TTS error: received unusually small audio response (" +
          blob.size +
          " bytes). Payload preview: " +
          textPreview.slice(0, 200)
      );
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error(
        "ElevenLabs TTS error: received unusually small audio response (" +
          blob.size +
          " bytes)."
      );
    }
  }
  return blob;
}

async function generateTtsAudioOpenAI(openAiKey, text) {
  if (!openAiKey) {
    throw new Error("Missing OpenAI API key. Add it in Settings.");
  }

  const trimmed = (text || "").trim();
  if (!trimmed) {
    throw new Error("TTS input script is empty.");
  }

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + openAiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "onyx",
      input: trimmed,
      // voice_instructions steer gpt-4o-mini-tts delivery style
      instructions: "You are an engaging podcast host. Speak naturally and warmly, with genuine enthusiasm. Use varied pacing — pause for effect, speed up when excited, slow down for key points. Sound like you're telling a friend something fascinating, not reading from a script."
    })
  });

  if (!res.ok) {
    let details = "";
    try {
      const body = await res.json();
      const raw =
        body.error?.message || body.message || body.detail || body || undefined;
      const msg =
        typeof raw === "string" ? raw : JSON.stringify(raw, null, 2);
      if (msg) {
        details = " – " + msg;
      }
    } catch (e) {
      // ignore parse errors, fall back to status only
    }
    throw new Error("OpenAI TTS API error: " + res.status + details);
  }

  const contentType = res.headers.get("content-type") || "";

  // If OpenAI returns JSON, surface the error instead of saving as audio.
  if (contentType.includes("application/json") || contentType.includes("text/")) {
    try {
      const json = await res.json();
      const msg =
        json.error?.message ||
        json.detail ||
        json.message ||
        JSON.stringify(json, null, 2);
      throw new Error("OpenAI TTS error: " + msg);
    } catch (e) {
      throw new Error("OpenAI TTS error: received non-audio response.");
    }
  }

  const blob = await res.blob();
  if (blob.size < 1024) {
    let preview = "";
    try {
      preview = await blob.text();
    } catch (_) {
      // ignore
    }
    throw new Error(
      "OpenAI TTS error: received unexpectedly small audio (" +
        blob.size +
        " bytes). Preview: " +
        preview.slice(0, 200)
    );
  }
  return blob;
}

async function generateTtsAudio(text) {
  const { ttsApiKey, openAiApiKey, ttsProvider } = await getStoredKeys();
  const provider =
    ttsProvider ||
    (openAiApiKey ? "openai" : ttsApiKey ? "elevenlabs" : "openai");

  if (provider === "elevenlabs") {
    return generateTtsAudioElevenLabs(ttsApiKey, text);
  }

  // default to OpenAI
  return generateTtsAudioOpenAI(openAiApiKey, text);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) {
    return false;
  }

  if (msg.type === "GENERATE_PODCAST_SCRIPT") {
    (async () => {
      try {
        const keys = await getStoredKeys();
        const model = msg.payload?.model || GEMINI_PRIMARY;
        const { script, rawOutput } = await generatePodcastScript(
          model,
          keys,
          msg.payload?.title || "Untitled Page",
          msg.payload?.text || "",
          msg.payload?.pageUrl || ""
        );

        // Parse embedded metadata block first; fall back to separate LLM call
        const { geminiApiKey, openAiApiKey } = keys;
        const meta = await generateEpisodeMeta(geminiApiKey, openAiApiKey, rawOutput);
        const episodeTitle       = meta?.title       || msg.payload?.title || "Untitled Episode";
        const episodeDescription = meta?.description || "";
        const seoMeta            = meta?.seoMeta     || null;

        const createdAt = new Date().toISOString();
        const id = Date.now().toString();
        const historyEntry = {
          id,
          title: episodeTitle,
          url: msg.payload?.pageUrl || "",
          createdAt,
          script,
          episodeDescription,
          seoMeta,
          source: "generate",
        };
        await addHistoryEntry(historyEntry);
        syncEpisodeToWebApp(historyEntry); // fire-and-forget
        sendResponse({ ok: true, script, episodeTitle, episodeDescription, seoMeta });
      } catch (err) {
        console.error("GENERATE_PODCAST_SCRIPT error", err);
        sendResponse({ ok: false, error: err.message || "Unknown error" });
      }
    })();
    return true;
  }

  if (msg.type === "GENERATE_EPISODE_META") {
    (async () => {
      try {
        const { geminiApiKey, openAiApiKey } = await getStoredKeys();
        if (!geminiApiKey && !openAiApiKey) {
          sendResponse({ ok: false, error: "No AI key configured. Add a Gemini or OpenAI key in Settings." });
          return;
        }
        const meta = await generateEpisodeMeta(geminiApiKey, openAiApiKey, msg.payload?.script || "");
        if (!meta) {
          sendResponse({ ok: false, error: "Could not generate title and description. Try again." });
          return;
        }
        sendResponse({ ok: true, episodeTitle: meta.title, episodeDescription: meta.description });
      } catch (err) {
        sendResponse({ ok: false, error: err.message || "Unknown error" });
      }
    })();
    return true;
  }

  if (msg.type === "GENERATE_TTS_AUDIO") {
    (async () => {
      try {
        const blob = await generateTtsAudio(msg.payload?.scriptText || "");
        // Blob is not structured-cloneable across the extension message channel.
        // ArrayBuffers can also arrive corrupted from service workers.
        // Base64 string is the only fully reliable binary transport via sendResponse.
        const arrayBuffer = await blob.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < uint8.length; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binary);
        sendResponse({ ok: true, base64, mimeType: blob.type || "audio/mpeg" });
      } catch (err) {
        console.error("GENERATE_TTS_AUDIO error", err);
        sendResponse({ ok: false, error: err.message || "Unknown error" });
      }
    })();
    return true;
  }

  if (msg.type === "AUTO_GENERATE_START") {
    scheduleAutoGenerate();
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === "AUTO_GENERATE_STOP") {
    chrome.alarms.clear("autoGenerate");
    sendResponse({ ok: true });
    return true;
  }

  return false;
});

// ── Auto-generate pipeline ───────────────────────────────────────

function scheduleAutoGenerate() {
  // Check every hour — the alarm fires even if the popup is closed
  chrome.alarms.create("autoGenerate", { periodInMinutes: 60 });
  console.log("Auto-generate alarm scheduled (every 60 min).");
}

function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title,
    message
  });
}

async function runAutoPipeline() {
  console.log("Auto-generate: checking for new scout update…");

  const {
    autoGenerate,
    yutoriApiKey,
    ttsApiKey,
    geminiApiKey, openAiApiKey,
    buzzsproutApiKey, buzzsproutPodcastId,
    hostName, podcastCategory,
    lastProcessedUpdateId
  } = await chrome.storage.sync.get([
    "autoGenerate", "yutoriApiKey", "ttsApiKey",
    "geminiApiKey", "openAiApiKey",
    "buzzsproutApiKey", "buzzsproutPodcastId",
    "hostName", "podcastCategory",
    "lastProcessedUpdateId"
  ]);

  if (!autoGenerate) return;

  // Validate required keys
  if (!yutoriApiKey) { console.log("Auto-generate: no Yutori key."); return; }
  if (!ttsApiKey)    { notify("Page2Podcast — Auto-generate failed", "No ElevenLabs key configured. Add it in Settings."); return; }
  if (!geminiApiKey && !openAiApiKey) { notify("Page2Podcast — Auto-generate failed", "No AI key configured. Add a Gemini or OpenAI key in Settings."); return; }
  if (!buzzsproutApiKey || !buzzsproutPodcastId) { notify("Page2Podcast — Auto-generate failed", "Buzzsprout not configured. Add your API key and Podcast ID in Settings."); return; }

  try {
    // 1. Fetch scouts
    const scoutsRes = await fetch("https://api.yutori.com/v1/scouting/tasks?page_size=50", {
      headers: { "X-API-Key": yutoriApiKey, "Content-Type": "application/json" }
    });
    if (!scoutsRes.ok) throw new Error("Failed to fetch scouts: HTTP " + scoutsRes.status);
    const scoutsData = await scoutsRes.json();
    const scouts = (scoutsData.scouts || []).filter(s => s.status !== "deleted" && s.status !== "archived");

    if (!scouts.length) { console.log("Auto-generate: no active scouts."); return; }

    // Use the first active scout
    const scout = scouts[0];

    // 2. Fetch latest update
    const updatesRes = await fetch(
      `https://api.yutori.com/v1/scouting/tasks/${scout.id}/updates?limit=1`,
      { headers: { "X-API-Key": yutoriApiKey, "Content-Type": "application/json" } }
    );
    if (!updatesRes.ok) throw new Error("Failed to fetch updates: HTTP " + updatesRes.status);
    const updatesData = await updatesRes.json();

    let updates = [];
    if (Array.isArray(updatesData))             updates = updatesData;
    else if (Array.isArray(updatesData.updates)) updates = updatesData.updates;
    else if (Array.isArray(updatesData.items))   updates = updatesData.items;
    else {
      const first = Object.values(updatesData).find(v => Array.isArray(v));
      updates = first || [];
    }

    if (!updates.length) { console.log("Auto-generate: no updates yet."); return; }

    const latest = updates[0];
    const updateId = latest.id || latest.update_id || latest.created_at;

    // 3. Check if already processed
    if (updateId && updateId === lastProcessedUpdateId) {
      console.log("Auto-generate: no new update since last run.");
      return;
    }

    console.log("Auto-generate: new update found, starting pipeline…");
    notify("Page2Podcast — Auto-generate started", `New scout update found. Generating episode…`);

    // 4. Extract content
    const rawContent = latest.output || latest.content || latest.result || latest.summary || "";
    const contentText = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent, null, 2);
    const scoutName = scout.query || scout.name || "Scout Update";

    // 5. Generate script
    const keys = { geminiApiKey, openAiApiKey };
    const { script, rawOutput } = await generatePodcastScript(GEMINI_PRIMARY, keys, scoutName, contentText, "");
    if (!script) throw new Error("Script generation returned empty.");

    // 6. Generate episode metadata (parse embedded block first, fallback to separate call)
    const meta = await generateEpisodeMeta(geminiApiKey, openAiApiKey, rawOutput);
    const episodeTitle = meta?.title || scoutName;
    const episodeDescription = meta?.description || "";

    // 7. Generate audio via ElevenLabs (always, regardless of user TTS setting)
    const audioBlob = await generateTtsAudioElevenLabs(ttsApiKey, script);

    // 8. Publish to Buzzsprout as draft
    const formData = new FormData();
    formData.append("title",       episodeTitle);
    formData.append("audio_file",  audioBlob, "episode.mp3");
    formData.append("description", episodeDescription);
    if (hostName)        formData.append("artist", hostName);
    if (podcastCategory) formData.append("tags",   podcastCategory);
    // No published_at = draft in Buzzsprout

    const buzzRes = await fetch(
      `https://www.buzzsprout.com/api/${buzzsproutPodcastId}/episodes.json`,
      {
        method: "POST",
        headers: { Authorization: "Token token=" + buzzsproutApiKey },
        body: formData
      }
    );
    if (!buzzRes.ok) {
      let msg = "HTTP " + buzzRes.status;
      try { const b = await buzzRes.json(); msg = b.error || b.message || msg; } catch (_) {}
      throw new Error("Buzzsprout error: " + msg);
    }
    const episode = await buzzRes.json();

    // 9. Save to history + sync to web app
    const autoEntry = {
      id: Date.now().toString(),
      title: episodeTitle,
      url: "",
      createdAt: new Date().toISOString(),
      script,
      episodeDescription,
      buzzsproutEpisodeId: String(episode.id),
      source: "auto",
    };
    await addHistoryEntry(autoEntry);
    syncEpisodeToWebApp(autoEntry); // fire-and-forget

    // 10. Mark update as processed
    await chrome.storage.sync.set({ lastProcessedUpdateId: updateId });

    // 11. Notify success
    const dashboardUrl = `https://www.buzzsprout.com/${buzzsproutPodcastId}/episodes/${episode.id}`;
    console.log("Auto-generate: success →", dashboardUrl);
    notify(
      "Page2Podcast — New draft ready!",
      `"${episodeTitle}" saved as draft in Buzzsprout. Tap to review.`
    );

  } catch (err) {
    console.error("Auto-generate pipeline error:", err);
    notify("Page2Podcast — Auto-generate failed", err.message || "Unknown error. Check extension logs.");
  }
}

// ── Alarm listener ───────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "autoGenerate") {
    runAutoPipeline().catch(err => console.error("Auto-pipeline uncaught error:", err));
  }
});

// ── On install/startup: restore alarm if auto-generate was enabled ──
chrome.runtime.onStartup.addListener(async () => {
  const { autoGenerate } = await chrome.storage.sync.get(["autoGenerate"]);
  if (autoGenerate) scheduleAutoGenerate();
});

chrome.runtime.onInstalled.addListener(async () => {
  const { autoGenerate } = await chrome.storage.sync.get(["autoGenerate"]);
  if (autoGenerate) scheduleAutoGenerate();
});

