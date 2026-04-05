// Open the side panel whenever the toolbar icon is clicked.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

async function getStoredKeys() {
  const { geminiApiKey, ttsApiKey, openAiApiKey, ttsProvider } =
    await chrome.storage.sync.get([
      "geminiApiKey",
      "ttsApiKey",
      "openAiApiKey",
      "ttsProvider"
    ]);
  return { geminiApiKey, ttsApiKey, openAiApiKey, ttsProvider };
}

async function addHistoryEntry(entry) {
  const { podcastHistory = [] } = await chrome.storage.session.get([
    "podcastHistory"
  ]);
  const next = [entry, ...podcastHistory];
  // keep only the most recent 30 entries for this session
  await chrome.storage.session.set({
    podcastHistory: next.slice(0, 30)
  });
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
      return "about 2–3 minutes";
    case "long":
      return "about 8–10 minutes";
    case "medium":
    default:
      return "about 5–7 minutes";
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

async function generatePodcastScript(apiKey, title, text, pageUrl) {
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Add it in Settings.");
  }

  const maxInput = 8000;
  const clippedText = (text || "").slice(0, maxInput);

  if (!clippedText.trim()) {
    throw new Error("No content detected on this page.");
  }

  const { targetLength, tone, podcastName, hostName } =
    await chrome.storage.sync.get([
      "targetLength",
      "tone",
      "podcastName",
      "hostName"
    ]);

  const toneDescription = mapToneToDescription(tone);
  const targetDuration = mapLengthToDuration(targetLength);
  const pageTypeHint = inferPageTypeHint(pageUrl);

  const safePodcastName =
    podcastName || "Page2Podcast – working title podcast";
  const safeHostName = hostName || "your host";

  const prompt = `
You are ${safeHostName}, host of "${safePodcastName}". Write the full spoken script for one podcast episode based on the content below.

══════════════════════════════════════════
THIS IS AUDIO. THE LISTENER CANNOT SEE ANYTHING.
WRITE EXACTLY WHAT YOU WOULD SAY INTO A MICROPHONE.
══════════════════════════════════════════

MANDATORY SPEECH RULES — violating any of these is a failure:

1. CONTRACTIONS EVERYWHERE. Never: "I am", "it is", "do not", "we are", "that is".
   Always: "I’m", "it’s", "don’t", "we’re", "that’s". No exceptions.

2. SENTENCE RHYTHM — mix very short sentences with longer flowing ones.
   Bad: "AI agents are autonomous systems that can perform tasks."
   Good: "AI agents act on their own. They don’t wait to be told. They just... go."

3. PAUSES & BREATH — use ellipses (...) for dramatic pauses and em-dashes (—) for
   natural speech breaks mid-sentence. "And here’s the thing — nobody saw this coming."

4. HOST REACTIONS — respond to what you’re saying as if hearing it for the first time:
   "I mean, think about that for a second.", "Wild, right?", "That’s the part that got me."

5. RHETORICAL QUESTIONS — pull listeners in every 2–3 paragraphs:
   "So what does that actually mean for you?", "Sound familiar?", "But here’s what nobody talks about..."

6. NATURAL CONNECTORS — start sentences with: And, But, So, Because, Now, Look, Here’s the thing.
   BANNED words: Furthermore, Moreover, Additionally, In conclusion, In summary, Notably, It is worth noting.

7. NO LISTS. Never "First... Second... Third..." — weave ideas together conversationally.

8. NEVER say: "this article", "this page", "this content", "as mentioned", "as stated", "the author".
   You discovered this — talk about it as if you found it yourself.

TONE: ${toneDescription}
TARGET LENGTH: ${targetDuration}
PAGE TYPE: ${pageTypeHint}

STRUCTURE (flow naturally, no section labels in output):
• Open with a hook — a bold statement or question, no intro yet, just grab them
• Welcome — "Welcome to ${safePodcastName}, I’m ${safeHostName}..." — set up what this episode is about
• Body — 3–4 ideas from the content, each with a story, analogy, or real example; transition naturally
• Takeaways — 3–5 things the listener can think or do differently, spoken naturally not as a list
• Close — warm wrap-up, genuine sign-off

OUTPUT: Plain text only. No headers, labels, brackets, or stage directions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page title: ${title}

Content (focus on the strongest ideas):
${clippedText}
`;

  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
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
      if (msg) {
        details = " – " + msg;
      }
    } catch (e) {
      // ignore JSON parse errors, fall back to status only
    }
    throw new Error("Gemini API error: " + res.status + details);
  }

  const data = await res.json();
  const parts =
    data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join(" ") ||
    "";
  const script = parts.trim();

  if (!script) {
    throw new Error("Gemini returned an empty script. Try again.");
  }

  return script;
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
        const { geminiApiKey } = await getStoredKeys();
        const script = await generatePodcastScript(
          geminiApiKey,
          msg.payload?.title || "Untitled Page",
          msg.payload?.text || "",
          msg.payload?.pageUrl || ""
        );
        const createdAt = new Date().toISOString();
        const id = Date.now().toString();
        await addHistoryEntry({
          id,
          title: msg.payload?.title || "Untitled Page",
          url: msg.payload?.pageUrl || "",
          createdAt,
          script
        });
        sendResponse({ ok: true, script });
      } catch (err) {
        console.error("GENERATE_PODCAST_SCRIPT error", err);
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

  return false;
});

