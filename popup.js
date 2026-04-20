// ── DOM refs — main UI ──────────────────────────────────────────
const onboardingSection  = document.getElementById("onboardingSection");
const mainSection        = document.getElementById("mainSection");
const settingsView       = document.getElementById("settingsView");
const statusRow          = document.getElementById("statusRow");
const statusDot          = document.getElementById("statusDot");
const statusText         = document.getElementById("statusText");
const pageTitleEl        = document.getElementById("pageTitle");
const scriptContainer    = document.getElementById("scriptContainer");
const scriptTextArea     = document.getElementById("scriptText");
const downloadSection    = document.getElementById("downloadSection");
const errorText          = document.getElementById("errorText");

const episodeMetaSection = document.getElementById("episodeMetaSection");
const episodeTitleField  = document.getElementById("episodeTitleField");
const episodeDescField   = document.getElementById("episodeDescField");

const seoMetaSection     = document.getElementById("seoMetaSection");
const seoTitleVal        = document.getElementById("seoTitleVal");
const seoAltTitles       = document.getElementById("seoAltTitles");
const seoChaptersVal     = document.getElementById("seoChaptersVal");
const seoTagsVal         = document.getElementById("seoTagsVal");
const seoThumbnailVal    = document.getElementById("seoThumbnailVal");
const seoYtDescVal       = document.getElementById("seoYtDescVal");

const audioPlayer        = document.getElementById("audioPlayer");
const customAudioPlayer  = document.getElementById("customAudioPlayer");

const generateBtn        = document.getElementById("generateBtn");
const generateAudioBtn   = document.getElementById("generateAudioBtn");
const regenerateScriptBtn= document.getElementById("regenerateScriptBtn");
const downloadBtn        = document.getElementById("downloadBtn");
const settingsBtn        = document.getElementById("settingsBtn");
const openSettingsFromOnboarding = document.getElementById("openSettingsFromOnboarding");

const stepExtract = document.getElementById("step-extract");
const stepPlan    = document.getElementById("step-plan");
const stepScript  = document.getElementById("step-script");
const stepAudio   = document.getElementById("step-audio");
const stepFinal   = document.getElementById("step-final");

const tabGenerate  = document.getElementById("tabGenerate");
const tabScript    = document.getElementById("tabScript");
const tabScouts    = document.getElementById("tabScouts");
const tabHistory   = document.getElementById("tabHistory");
const generateView = document.getElementById("generateView");
const scriptView   = document.getElementById("scriptView");
const scoutsView   = document.getElementById("scoutsView");
const historyView  = document.getElementById("historyView");

// ── DOM refs — scouts tab ────────────────────────────────────────
const scoutsNoKey        = document.getElementById("scoutsNoKey");
const scoutsLoading      = document.getElementById("scoutsLoading");
const scoutsEmpty        = document.getElementById("scoutsEmpty");
const scoutsList         = document.getElementById("scoutsList");
const scoutDetail        = document.getElementById("scoutDetail");
const scoutDetailName    = document.getElementById("scoutDetailName");
const scoutUpdateDate    = document.getElementById("scoutUpdateDate");
const scoutUpdateContent = document.getElementById("scoutUpdateContent");
const scoutBackBtn       = document.getElementById("scoutBackBtn");
const scoutsRefreshBtn   = document.getElementById("scoutsRefreshBtn");
const scoutsGoToSettings = document.getElementById("scoutsGoToSettings");
const scoutGenerateBtn   = document.getElementById("scoutGenerateBtn");
const scoutError         = document.getElementById("scoutError");
const historyList  = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");

// ── DOM refs — script tab ────────────────────────────────────────
const customEpisodeTitle   = document.getElementById("customEpisodeTitle");
const customEpisodeDesc    = document.getElementById("customEpisodeDesc");
const customGenerateMetaBtn= document.getElementById("customGenerateMetaBtn");
const customScriptInput    = document.getElementById("customScriptInput");
const customScriptWordCount= document.getElementById("customScriptWordCount");
const customScriptClear    = document.getElementById("customScriptClear");
const customScriptAudioBtn = document.getElementById("customScriptAudioBtn");
const customDownloadSection= document.getElementById("customDownloadSection");
const customDownloadBtn    = document.getElementById("customDownloadBtn");
const customPublishBtn     = document.getElementById("customPublishBtn");
const customPublishResult  = document.getElementById("customPublishResult");
const customErrorText      = document.getElementById("customErrorText");

// ── DOM refs — settings ─────────────────────────────────────────
const settingsBackBtn  = document.getElementById("settingsBackBtn");
const sGeminiKey       = document.getElementById("sGeminiKey");
const sOpenAiKey       = document.getElementById("sOpenAiKey");
const sTtsKey          = document.getElementById("sTtsKey");
const sElevenVoiceId   = document.getElementById("sElevenVoiceId");
const sGeminiHint      = document.getElementById("sGeminiHint");
const sOpenAiHint      = document.getElementById("sOpenAiHint");
const sTtsHint         = document.getElementById("sTtsHint");
const sTtsProvider     = document.getElementById("sTtsProvider");
const sPodcastName     = document.getElementById("sPodcastName");
const sHostName        = document.getElementById("sHostName");
const sLengthSelect    = document.getElementById("sLengthSelect");
const sToneSelect      = document.getElementById("sToneSelect");
const sSaveKeysBtn     = document.getElementById("sSaveKeysBtn");
const sClearKeysBtn    = document.getElementById("sClearKeysBtn");
const sSavePrefsBtn    = document.getElementById("sSavePrefsBtn");
const sStatusText      = document.getElementById("sStatusText");
const sLengthHint      = document.getElementById("sLengthHint");

// ── DOM refs — podcast identity ─────────────────────────────────
const sSponsorLine      = document.getElementById("sSponsorLine");
const sPodcastDesc      = document.getElementById("sPodcastDesc");
const sPodcastCategory  = document.getElementById("sPodcastCategory");
const sEpisodeFormat    = document.getElementById("sEpisodeFormat");
const sTargetAudience   = document.getElementById("sTargetAudience");
const sCustomSegments   = document.getElementById("sCustomSegments");
const sEpisodeTemplate  = document.getElementById("sEpisodeTemplate");
const sSaveIdentityBtn  = document.getElementById("sSaveIdentityBtn");

// ── DOM refs — model selector ────────────────────────────────────
const modelSelect = document.getElementById("modelSelect");

// ── DOM refs — Buzzsprout ────────────────────────────────────────
const publishBtn            = document.getElementById("publishBtn");
const publishResult         = document.getElementById("publishResult");
const sAnthropicKey    = document.getElementById("sAnthropicKey");
const sAnthropicHint   = document.getElementById("sAnthropicHint");
const sBuzzsproutKey        = document.getElementById("sBuzzsproutKey");
const sBuzzsproutPodcastId  = document.getElementById("sBuzzsproutPodcastId");
const sBuzzsproutPublishMode= document.getElementById("sBuzzsproutPublishMode");
const sBuzzsproutKeyHint    = document.getElementById("sBuzzsproutKeyHint");
const sSaveBuzzsproutBtn    = document.getElementById("sSaveBuzzsproutBtn");
const sClearBuzzsproutBtn   = document.getElementById("sClearBuzzsproutBtn");

// ── DOM refs — Web App Sync settings ─────────────────────────────
const sWebAppUrl            = document.getElementById("sWebAppUrl");
const sWebAppSecret         = document.getElementById("sWebAppSecret");
const sSaveWebAppBtn        = document.getElementById("sSaveWebAppBtn");
const sClearWebAppBtn       = document.getElementById("sClearWebAppBtn");
const sWebAppStatus         = document.getElementById("sWebAppStatus");

// ── DOM refs — Yutori settings ───────────────────────────────────
const sYutoriKey         = document.getElementById("sYutoriKey");
const sYutoriKeyHint     = document.getElementById("sYutoriKeyHint");
const sSaveYutoriBtn     = document.getElementById("sSaveYutoriBtn");
const sClearYutoriBtn    = document.getElementById("sClearYutoriBtn");
const sScoutQuery          = document.getElementById("sScoutQuery");
const sScoutInterval       = document.getElementById("sScoutInterval");
const sCreateScoutBtn      = document.getElementById("sCreateScoutBtn");
const sCreateScoutStatus   = document.getElementById("sCreateScoutStatus");
const sScoutSummary        = document.getElementById("sScoutSummary");
const sAutoGenerate        = document.getElementById("sAutoGenerate");
const sCreateScoutSection  = document.getElementById("sCreateScoutSection");
const sScoutExistsNote     = document.getElementById("sScoutExistsNote");

// ── State ────────────────────────────────────────────────────────
let currentScript        = "";
let currentPageTitle     = "";
let currentPageUrl       = "";
let currentEpisodeTitle  = "";
let currentEpisodeDesc   = "";
let currentSeoMeta       = null;
let audioBlob            = null;
let previousView         = "main"; // "main" | "onboarding"

// ── SEO metadata panel ───────────────────────────────────────────
function populateSeoMeta(meta) {
  if (!meta) { seoMetaSection.classList.add("hidden"); return; }

  // SEO title + alt titles
  seoTitleVal.textContent = meta.altTitles?.[0] !== meta.youtubeDescLine1
    ? (meta.showNotes ? "" : "") + ""  // placeholder — set below
    : "";
  seoTitleVal.textContent = seoChaptersVal.value = ""; // reset

  seoTitleVal.textContent = meta.thumbnailText
    ? "" // set properly below
    : "";

  // Reset and fill each field cleanly
  seoTitleVal.textContent    = "";
  seoAltTitles.innerHTML     = "";
  seoChaptersVal.value       = "";
  seoTagsVal.innerHTML       = "";
  seoThumbnailVal.textContent = "";
  seoYtDescVal.textContent   = "";

  // SEO title — comes from the parent title field (already set as episodeTitleField)
  const mainTitle = episodeTitleField.value.trim() || currentEpisodeTitle || "";
  seoTitleVal.textContent = mainTitle;

  // Alt titles
  if (meta.altTitles?.length) {
    const label = document.createElement("p");
    label.className = "seo-alt-label";
    label.textContent = "Alternatives:";
    seoAltTitles.appendChild(label);
    meta.altTitles.forEach(alt => {
      if (!alt) return;
      const el = document.createElement("div");
      el.className = "seo-alt-item";
      el.textContent = alt;
      el.title = "Click to copy";
      el.addEventListener("click", () => copyText(alt, el));
      seoAltTitles.appendChild(el);
    });
  }

  // Chapters
  seoChaptersVal.value = meta.chapters || "";

  // Tags — render as pills
  if (meta.tags) {
    meta.tags.split(",").map(t => t.trim()).filter(Boolean).forEach(tag => {
      const pill = document.createElement("span");
      pill.className = "seo-tag";
      pill.textContent = tag;
      seoTagsVal.appendChild(pill);
    });
  }

  // Thumbnail text
  seoThumbnailVal.textContent = meta.thumbnailText || "";

  // YouTube description (2 lines)
  const ytDesc = [meta.youtubeDescLine1, meta.youtubeDescLine2].filter(Boolean).join("\n");
  seoYtDescVal.textContent = ytDesc;

  seoMetaSection.classList.remove("hidden");
}

// Copy text to clipboard, flash button
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 1500);
  });
}

// Wire copy buttons in the SEO panel (delegated)
document.getElementById("seoMetaSection")?.addEventListener("click", e => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;
  const targetId = btn.dataset.target;
  const el = document.getElementById(targetId);
  if (!el) return;
  const text = el.tagName === "TEXTAREA" ? el.value : el.innerText;
  copyText(text, btn);
});

// ── View management ──────────────────────────────────────────────
function showView(view) {
  onboardingSection.classList.add("hidden");
  mainSection.classList.add("hidden");
  settingsView.classList.add("hidden");

  if (view === "onboarding") { onboardingSection.classList.remove("hidden"); previousView = "onboarding"; }
  else if (view === "main")  { mainSection.classList.remove("hidden");       previousView = "main"; }
  else if (view === "settings") { settingsView.classList.remove("hidden"); loadSettingsForm(); }
}

// ── Tabs ─────────────────────────────────────────────────────────
function switchTab(tab) {
  [tabGenerate, tabScript, tabScouts, tabHistory].forEach(t => t.classList.remove("active"));
  [generateView, scriptView, scoutsView, historyView].forEach(v => v.classList.add("hidden"));

  if (tab === "history") {
    tabHistory.classList.add("active");
    historyView.classList.remove("hidden");
    loadHistory().catch(console.error);
  } else if (tab === "script") {
    tabScript.classList.add("active");
    scriptView.classList.remove("hidden");
  } else if (tab === "scouts") {
    tabScouts.classList.add("active");
    scoutsView.classList.remove("hidden");
    loadScouts().catch(console.error);
  } else {
    tabGenerate.classList.add("active");
    generateView.classList.remove("hidden");
  }
}

// ── Button loading helper ─────────────────────────────────────────
function setBtnLoading(btn, loading, loadingLabel) {
  if (loading) {
    if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `<span class="btn-spinner"></span>${loadingLabel}`;
    btn.disabled = true;
  } else {
    if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
    btn.disabled = false;
  }
}

// ── Status & steps ───────────────────────────────────────────────
function setStatus(state, message) {
  const messages = {
    idle:             "Ready to generate.",
    extracting:       "Extracting page content…",
    planning:         "Analysing content structure…",
    scriptGenerating: "Writing your podcast script…",
    audioGenerating:  "Generating audio — this takes 20–60s…",
    finalizing:       "Ready to download!",
    done:             "Your podcast is ready.",
    scriptReady:      "Script ready. Review it, then generate audio."
  };
  statusText.textContent = message || messages[state] || "Working…";

  const busy = ["extracting", "planning", "scriptGenerating", "audioGenerating"].includes(state);
  statusDot.style.display = busy ? "block" : "none";
  statusRow.classList.toggle("busy", busy);

  [stepExtract, stepPlan, stepScript, stepAudio, stepFinal].forEach(s => s.classList.remove("active"));
  const map = {
    idle: stepExtract, extracting: stepExtract, planning: stepPlan,
    scriptGenerating: stepScript, audioGenerating: stepAudio,
    finalizing: stepFinal, done: stepFinal
  };
  if (map[state]) map[state].classList.add("active");

  // Button states per phase
  switch (state) {
    case "idle":
      generateBtn.disabled = false;
      break;
    case "extracting":
      setBtnLoading(generateBtn, true, "Extracting page…");
      break;
    case "planning":
      setBtnLoading(generateBtn, true, "Analysing…");
      break;
    case "scriptGenerating":
      setBtnLoading(generateBtn, true, "Writing script…");
      break;
    case "scriptReady":
      // Restore generate button, keep audio buttons active
      setBtnLoading(generateBtn, false);
      generateBtn.disabled = false;
      generateAudioBtn.disabled = false;
      regenerateScriptBtn.disabled = false;
      break;
    case "audioGenerating":
      setBtnLoading(generateAudioBtn, true, "Generating audio…");
      regenerateScriptBtn.disabled = true;
      generateBtn.disabled = true;
      break;
    case "finalizing":
    case "done":
      setBtnLoading(generateAudioBtn, false);
      generateBtn.disabled = false;
      regenerateScriptBtn.disabled = false;
      downloadBtn.disabled = false;
      break;
  }
}

function showError(msg) {
  if (!msg) { errorText.classList.add("hidden"); errorText.textContent = ""; return; }
  errorText.textContent = msg;
  errorText.classList.remove("hidden");
  // Always restore buttons on error so user can retry
  setBtnLoading(generateBtn, false);
  setBtnLoading(generateAudioBtn, false);
  generateBtn.disabled = false;
  generateAudioBtn.disabled = false;
  regenerateScriptBtn.disabled = false;
}

// ── Chrome helpers ───────────────────────────────────────────────
async function hasKeys() {
  const { geminiApiKey, ttsApiKey, openAiApiKey } =
    await chrome.storage.sync.get(["geminiApiKey", "ttsApiKey", "openAiApiKey"]);
  return Boolean(geminiApiKey && (openAiApiKey || ttsApiKey));
}

async function detectPageTitle() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs?.[0];
      if (!tab) { resolve("Current page"); return; }
      currentPageUrl = tab.url || "";
      resolve(tab.title || "Current page");
    });
  });
}

async function extractPage() {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabId = tabs[0]?.id;
      if (!tabId) { resolve({ ok: false, error: "No active tab found." }); return; }
      chrome.tabs.sendMessage(tabId, { type: "EXTRACT_PAGE" }, response => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: "Cannot access this page. Try reloading or check if it's a restricted URL." });
        } else {
          resolve(response);
        }
      });
    });
  });
}

async function requestPodcastScript(title, text, pageUrl) {
  const selectedModel = modelSelect?.value || "gemini-2.5-flash";
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      { type: "GENERATE_PODCAST_SCRIPT", payload: { title, text, pageUrl, model: selectedModel } },
      response => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: "Could not reach background script. Try reopening the panel." });
        } else { resolve(response); }
      }
    );
  });
}

async function requestEpisodeMeta(script) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      { type: "GENERATE_EPISODE_META", payload: { script } },
      response => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: "Could not reach background script." });
        } else { resolve(response); }
      }
    );
  });
}

async function requestTtsAudio(scriptText) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      { type: "GENERATE_TTS_AUDIO", payload: { scriptText } },
      response => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: "Could not reach background script. Try reopening the panel." });
        } else { resolve(response); }
      }
    );
  });
}

// ── Generate flow ────────────────────────────────────────────────
function downloadBlobAsFile(blob, filename, mimeType) {
  const finalBlob = blob instanceof Blob ? blob : new Blob([blob], { type: mimeType || "audio/mpeg" });
  const url = URL.createObjectURL(finalBlob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function buildFilenameFromTitle(title) {
  const base  = (title || "page").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const clean = base.replace(/^-+|-+$/g, "") || "page";
  return `${clean}-podcast.mp3`;
}

async function handleGenerateScript() {
  showError("");
  scriptContainer.classList.add("hidden");
  episodeMetaSection.classList.add("hidden");
  seoMetaSection.classList.add("hidden");
  downloadSection.classList.add("hidden");
  publishResult.classList.add("hidden");
  if (audioPlayer.src) { URL.revokeObjectURL(audioPlayer.src); audioPlayer.src = ""; }
  audioBlob = null;

  setStatus("extracting");
  const extractRes = await extractPage();

  if (!extractRes || !extractRes.ok) {
    setStatus("idle");
    showError(extractRes?.error || "Could not detect readable content on this page. Try another page.");
    return;
  }

  const { title, text } = extractRes;
  currentPageTitle = title || (await detectPageTitle());
  pageTitleEl.textContent = currentPageTitle;

  if (!text || !text.trim()) {
    setStatus("idle");
    showError("Could not detect readable content on this page. Try another page.");
    return;
  }

  setStatus(text.length > 8000 ? "planning" : "planning",
    text.length > 8000 ? "Long page detected; using key sections for this episode." : undefined);

  setStatus("scriptGenerating");
  const scriptRes = await requestPodcastScript(title, text, currentPageUrl || "");

  if (!scriptRes || !scriptRes.ok) {
    setStatus("idle");
    showError(scriptRes?.error || "Something went wrong generating the script. Try again.");
    return;
  }

  currentScript       = scriptRes.script;
  currentEpisodeTitle = scriptRes.episodeTitle || currentPageTitle || "Untitled Episode";
  currentEpisodeDesc  = scriptRes.episodeDescription || "";
  currentSeoMeta      = scriptRes.seoMeta || null;
  scriptTextArea.value = currentScript;
  scriptContainer.classList.remove("hidden");
  setStatus("scriptReady");
}

async function handleGenerateAudio() {
  showError("");
  downloadSection.classList.add("hidden");
  audioBlob = null;

  currentScript = scriptTextArea.value || currentScript || "";
  if (!currentScript.trim()) {
    showError("Script is empty. Generate or paste a script first.");
    return;
  }

  setStatus("audioGenerating");
  const res = await requestTtsAudio(currentScript);

  if (!res || !res.ok || !res.base64) {
    setStatus("scriptReady");
    showError(res?.error || "Something went wrong generating the audio. Check your TTS settings and try again.");
    return;
  }

  const binaryString = atob(res.base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  audioBlob = new Blob([bytes], { type: res.mimeType || "audio/mpeg" });

  // Wire up the inline player
  if (audioPlayer.src) URL.revokeObjectURL(audioPlayer.src);
  audioPlayer.src = URL.createObjectURL(audioBlob);

  // Populate editable episode meta fields
  episodeTitleField.value = currentEpisodeTitle;
  episodeDescField.value  = currentEpisodeDesc;
  episodeMetaSection.classList.remove("hidden");

  // Populate SEO / YouTube metadata panel
  populateSeoMeta(currentSeoMeta);

  downloadSection.classList.remove("hidden");

  // Show publish button only when Buzzsprout is configured
  const { buzzsproutApiKey, buzzsproutPodcastId } =
    await chrome.storage.sync.get(["buzzsproutApiKey", "buzzsproutPodcastId"]);
  if (buzzsproutApiKey && buzzsproutPodcastId) {
    publishBtn.classList.remove("hidden");
    // Reset publish button in case user generated a second episode
    if (publishBtn.dataset.originalHtml) {
      publishBtn.innerHTML = publishBtn.dataset.originalHtml;
      delete publishBtn.dataset.originalHtml;
    }
    publishBtn.disabled = false;
  } else {
    publishBtn.classList.add("hidden");
  }
  publishResult.classList.add("hidden");

  setStatus("finalizing");
}

function handleDownload() {
  if (!audioBlob) { showError("No audio available to download yet."); return; }
  const title = episodeTitleField.value.trim() || currentEpisodeTitle || "episode";
  downloadBlobAsFile(audioBlob, buildFilenameFromTitle(title), "audio/mpeg");
  setStatus("done");
}

// ── Script tab ───────────────────────────────────────────────────
let customAudioBlob = null;

function updateWordCount() {
  const words = customScriptInput.value.trim().split(/\s+/).filter(Boolean).length;
  customScriptWordCount.textContent = words === 0 ? "0 words" : `${words.toLocaleString()} word${words === 1 ? "" : "s"}`;
}

function showCustomError(msg) {
  if (!msg) { customErrorText.classList.add("hidden"); customErrorText.textContent = ""; return; }
  customErrorText.textContent = msg;
  customErrorText.classList.remove("hidden");
  setBtnLoading(customScriptAudioBtn, false);
}

function showCustomPublishResult(type, html) {
  customPublishResult.innerHTML = html;
  customPublishResult.className = "publish-result " + type;
  customPublishResult.classList.remove("hidden");
}

async function handleCustomGenerateAudio() {
  const script = customScriptInput.value.trim();
  if (!script) {
    showCustomError("Paste a script first.");
    return;
  }

  showCustomError("");
  customDownloadSection.classList.add("hidden");
  customPublishResult.classList.add("hidden");
  customAudioBlob = null;

  setBtnLoading(customScriptAudioBtn, true, "Generating audio…");

  // Prepend sponsor line if configured
  const { sponsorLine, podcastName, hostName } =
    await chrome.storage.sync.get(["sponsorLine", "podcastName", "hostName"]);
  let scriptForTts = script;
  if (sponsorLine) {
    const safeName = podcastName || "Page2Podcast";
    const safeHost = hostName   || "your host";
    const intro = `${safeName}, brought to you by ${sponsorLine} — welcome back, I'm your host, ${safeHost}.\n\n`;
    // Only prepend if the script doesn't already open with a sponsor read
    if (!script.toLowerCase().includes("brought to you by")) {
      scriptForTts = intro + script;
    }
  }

  const res = await requestTtsAudio(scriptForTts);

  if (!res || !res.ok || !res.base64) {
    showCustomError(res?.error || "Audio generation failed. Check your TTS settings and try again.");
    return;
  }

  const binaryString = atob(res.base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  customAudioBlob = new Blob([bytes], { type: res.mimeType || "audio/mpeg" });

  // Save to history so it appears in the History tab
  const episodeTitle = customEpisodeTitle.value.trim() || "Manual Script";
  const { podcastHistory = [] } = await chrome.storage.local.get(["podcastHistory"]);
  const historyEntry = {
    id: Date.now().toString(),
    title: episodeTitle,
    url: "",
    createdAt: new Date().toISOString(),
    script: customScriptInput.value.trim(),
    episodeDescription: customEpisodeDesc.value.trim(),
    source: "manual"
  };
  await chrome.storage.local.set({
    podcastHistory: [historyEntry, ...podcastHistory].slice(0, 100)
  });

  setBtnLoading(customScriptAudioBtn, false);

  // Wire up the inline player
  if (customAudioPlayer.src) URL.revokeObjectURL(customAudioPlayer.src);
  customAudioPlayer.src = URL.createObjectURL(customAudioBlob);

  customDownloadSection.classList.remove("hidden");

  // Show publish button if Buzzsprout is configured
  const { buzzsproutApiKey, buzzsproutPodcastId } =
    await chrome.storage.sync.get(["buzzsproutApiKey", "buzzsproutPodcastId"]);
  if (buzzsproutApiKey && buzzsproutPodcastId) {
    customPublishBtn.classList.remove("hidden");
    if (customPublishBtn.dataset.originalHtml) {
      customPublishBtn.innerHTML = customPublishBtn.dataset.originalHtml;
      delete customPublishBtn.dataset.originalHtml;
    }
    customPublishBtn.disabled = false;
  } else {
    customPublishBtn.classList.add("hidden");
  }
}

function handleCustomDownload() {
  if (!customAudioBlob) { showCustomError("No audio yet. Generate audio first."); return; }
  const title = customEpisodeTitle.value.trim() || "custom-episode";
  downloadBlobAsFile(customAudioBlob, buildFilenameFromTitle(title), "audio/mpeg");
}

async function handleCustomPublish() {
  if (!customAudioBlob) { showCustomPublishResult("error", "No audio to publish."); return; }

  const { buzzsproutApiKey, buzzsproutPodcastId, buzzsproutPublishMode, hostName, podcastCategory } =
    await chrome.storage.sync.get([
      "buzzsproutApiKey", "buzzsproutPodcastId", "buzzsproutPublishMode",
      "hostName", "podcastCategory"
    ]);

  if (!buzzsproutApiKey || !buzzsproutPodcastId) {
    showCustomPublishResult("error", "Add your Buzzsprout API key and Podcast ID in Settings.");
    return;
  }

  setBtnLoading(customPublishBtn, true, "Publishing…");
  customPublishResult.classList.add("hidden");

  try {
    const episodeTitle    = customEpisodeTitle.value.trim() || "Custom Episode";
    const descriptionText = customEpisodeDesc.value.trim() || "";
    const publishedAt = buzzsproutPublishMode === "published" ? new Date().toISOString() : "";

    const formData = new FormData();
    formData.append("title",       episodeTitle);
    formData.append("audio_file",  customAudioBlob, "episode.mp3");
    formData.append("description", descriptionText);
    if (hostName)        formData.append("artist", hostName);
    if (podcastCategory) formData.append("tags",   podcastCategory);
    if (publishedAt)     formData.append("published_at", publishedAt);

    const res = await fetch(
      `https://www.buzzsprout.com/api/${buzzsproutPodcastId}/episodes.json`,
      {
        method: "POST",
        headers: { Authorization: "Token token=" + buzzsproutApiKey },
        body: formData
      }
    );

    if (!res.ok) {
      let msg = "HTTP " + res.status;
      try { const b = await res.json(); msg = b.error || b.message || JSON.stringify(b) || msg; } catch (_) {}
      throw new Error(msg);
    }

    const episode = await res.json();
    const dashboardUrl = `https://www.buzzsprout.com/${buzzsproutPodcastId}/episodes/${episode.id}`;
    const modeLabel = buzzsproutPublishMode === "published" ? "Published" : "Saved as draft";

    showCustomPublishResult(
      "success",
      `${modeLabel} · <a href="${dashboardUrl}" target="_blank" rel="noopener">View in Buzzsprout →</a>`
    );
    customPublishBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      ${modeLabel}
    `;
    customPublishBtn.disabled = true;
  } catch (err) {
    console.error("Custom publish error", err);
    showCustomPublishResult("error", "Publish failed: " + (err.message || "Unknown error"));
    setBtnLoading(customPublishBtn, false);
  }
}

// ── Scouts ───────────────────────────────────────────────────────
let activeScoutData = null; // { scout, update } for selected scout

function scoutsShowState(state) {
  scoutsNoKey.classList.add("hidden");
  scoutsLoading.classList.add("hidden");
  scoutsEmpty.classList.add("hidden");
  scoutsList.classList.add("hidden");
  scoutDetail.classList.add("hidden");
  scoutError.classList.add("hidden");

  if (state === "nokey")   scoutsNoKey.classList.remove("hidden");
  if (state === "loading") scoutsLoading.classList.remove("hidden");
  if (state === "empty")   scoutsEmpty.classList.remove("hidden");
  if (state === "list")    scoutsList.classList.remove("hidden");
  if (state === "detail")  scoutDetail.classList.remove("hidden");
}

async function yutoriFetch(path, apiKey) {
  const res = await fetch(`https://api.yutori.com${path}`, {
    headers: { "X-API-Key": apiKey, "Content-Type": "application/json" }
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const b = await res.json(); msg = b.detail || b.message || msg; } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

async function yutoriFetchPost(path, apiKey) {
  const res = await fetch(`https://api.yutori.com${path}`, {
    method: "POST",
    headers: { "X-API-Key": apiKey, "Content-Type": "application/json" }
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const b = await res.json(); msg = b.detail || b.message || msg; } catch (_) {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({}));
}

async function yutoriFetchDelete(path, apiKey) {
  const res = await fetch(`https://api.yutori.com${path}`, {
    method: "DELETE",
    headers: { "X-API-Key": apiKey, "Content-Type": "application/json" }
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const b = await res.json(); msg = b.detail || b.message || msg; } catch (_) {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({}));
}

async function loadScouts() {
  const { yutoriApiKey } = await chrome.storage.sync.get(["yutoriApiKey"]);
  if (!yutoriApiKey) { scoutsShowState("nokey"); return; }

  scoutsShowState("loading");
  scoutsRefreshBtn.disabled = true;

  try {
    const data = await yutoriFetch("/v1/scouting/tasks?page_size=50", yutoriApiKey);

    // Yutori API returns { scouts: [...] }
    let rawList = [];
    if (Array.isArray(data))              rawList = data;
    else if (Array.isArray(data.scouts))  rawList = data.scouts;
    else if (Array.isArray(data.items))   rawList = data.items;
    else if (Array.isArray(data.tasks))   rawList = data.tasks;
    else if (Array.isArray(data.data))    rawList = data.data;
    else {
      const firstArr = Object.values(data).find(v => Array.isArray(v));
      rawList = firstArr || [];
    }

    const scouts = rawList.filter(s => s.status !== "deleted" && s.status !== "archived");

    scoutsList.innerHTML = "";

    if (!scouts.length) {
      scoutsEmpty.textContent = "No scouts yet. Create one in Settings → Yutori Scouts.";
      scoutsShowState("empty");
      return;
    }

    scouts.forEach(scout => {
      const li = document.createElement("li");
      li.className = "scout-item";

      const nameEl = document.createElement("div");
      nameEl.className = "scout-item-name";
      nameEl.textContent = scout.query || scout.name || `Scout ${scout.id.slice(0, 8)}`;

      const bottomRow = document.createElement("div");
      bottomRow.className = "scout-item-bottom";

      const metaEl = document.createElement("div");
      metaEl.className = "scout-item-meta";

      const statusEl = document.createElement("span");
      const st = scout.status || "unknown";
      statusEl.className = `scout-status ${st}`;
      statusEl.textContent = st;

      const intervalEl = document.createElement("span");
      const hours = scout.output_interval ? Math.round(scout.output_interval / 3600) : null;
      intervalEl.textContent = hours ? `every ${hours}h` : "";

      metaEl.append(statusEl, intervalEl);

      // Action buttons
      const actionsEl = document.createElement("div");
      actionsEl.className = "scout-item-actions";

      const isPaused = st === "paused";
      const pauseBtn = document.createElement("button");
      pauseBtn.className = "scout-action-btn";
      pauseBtn.textContent = isPaused ? "Resume" : "Pause";
      pauseBtn.title = isPaused ? "Resume this scout" : "Pause this scout";
      pauseBtn.addEventListener("click", async e => {
        e.stopPropagation();
        pauseBtn.disabled = true;
        pauseBtn.textContent = "…";
        try {
          const action = isPaused ? "resume" : "pause";
          await yutoriFetchPost(`/v1/scouting/tasks/${scout.id}/${action}`, yutoriApiKey);
          await loadScouts();
        } catch (err) {
          pauseBtn.textContent = isPaused ? "Resume" : "Pause";
          pauseBtn.disabled = false;
          alert("Failed: " + err.message);
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "scout-action-btn scout-action-delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.title = "Delete this scout";
      deleteBtn.addEventListener("click", async e => {
        e.stopPropagation();
        if (!confirm("Delete this scout permanently?")) return;
        deleteBtn.disabled = true;
        deleteBtn.textContent = "…";
        try {
          await yutoriFetchDelete(`/v1/scouting/tasks/${scout.id}`, yutoriApiKey);
          await loadScouts();
        } catch (err) {
          deleteBtn.textContent = "Delete";
          deleteBtn.disabled = false;
          alert("Failed: " + err.message);
        }
      });

      actionsEl.append(pauseBtn, deleteBtn);
      bottomRow.append(metaEl, actionsEl);
      li.append(nameEl, bottomRow);

      li.addEventListener("click", () => openScoutDetail(scout, yutoriApiKey));
      scoutsList.appendChild(li);
    });

    scoutsShowState("list");
  } catch (err) {
    scoutsShowState("empty");
    scoutsEmpty.textContent = "Failed to load scouts: " + err.message;
    scoutsEmpty.classList.remove("hidden");
  } finally {
    scoutsRefreshBtn.disabled = false;
  }
}

async function openScoutDetail(scout, apiKey) {
  scoutDetailName.textContent = scout.query || scout.name || `Scout ${scout.id.slice(0, 8)}`;
  scoutUpdateDate.textContent = "";
  scoutUpdateContent.textContent = "Loading latest update…";
  scoutError.classList.add("hidden");
  scoutsShowState("detail");

  try {
    const data = await yutoriFetch(`/v1/scouting/tasks/${scout.id}/updates?limit=1`, apiKey);
    let updates = [];
    if (Array.isArray(data))             updates = data;
    else if (Array.isArray(data.items))  updates = data.items;
    else if (Array.isArray(data.updates))updates = data.updates;
    else if (Array.isArray(data.data))   updates = data.data;
    else {
      const firstArr = Object.values(data).find(v => Array.isArray(v));
      updates = firstArr || [];
    }

    if (!updates.length) {
      scoutUpdateContent.textContent = "No updates yet for this scout.";
      scoutGenerateBtn.disabled = true;
      return;
    }

    const latest = updates[0];
    activeScoutData = { scout, update: latest };

    // Format the date
    const dateStr = latest.created_at || latest.timestamp || latest.completed_at || "";
    scoutUpdateDate.textContent = dateStr
      ? new Date(dateStr).toLocaleString()
      : "";

    // Extract text content from the update
    const content = latest.output || latest.content || latest.result || latest.summary || JSON.stringify(latest, null, 2);
    const rawHtml = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    // Render HTML content (strip script/style tags for safety, allow formatting tags)
    const sanitized = rawHtml
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "");
    scoutUpdateContent.innerHTML = sanitized;

    scoutGenerateBtn.disabled = false;
  } catch (err) {
    scoutUpdateContent.textContent = "Failed to load update: " + err.message;
    scoutGenerateBtn.disabled = true;
  }
}

async function handleScoutGenerate() {
  if (!activeScoutData) return;
  const { scout, update } = activeScoutData;

  // Extract the content text to feed into Gemini
  const rawContent = update.output || update.content || update.result || update.summary || "";
  const contentText = typeof rawContent === "string"
    ? rawContent
    : JSON.stringify(rawContent, null, 2);

  const scoutName = scout.query || scout.name || "Scout Update";

  // Show progress back in the Generate tab
  switchTab("generate");
  showError("");
  scriptContainer.classList.add("hidden");
  episodeMetaSection.classList.add("hidden");
  seoMetaSection.classList.add("hidden");
  downloadSection.classList.add("hidden");
  publishResult.classList.add("hidden");
  if (audioPlayer.src) { URL.revokeObjectURL(audioPlayer.src); audioPlayer.src = ""; }
  audioBlob = null;
  currentPageUrl = "";
  currentPageTitle = scoutName;
  pageTitleEl.textContent = scoutName;

  setStatus("planning", "Processing Scout update…");
  setStatus("scriptGenerating");

  const scriptRes = await requestPodcastScript(scoutName, contentText, "");

  if (!scriptRes || !scriptRes.ok) {
    setStatus("idle");
    showError(scriptRes?.error || "Script generation failed. Try again.");
    return;
  }

  currentScript       = scriptRes.script;
  currentEpisodeTitle = scriptRes.episodeTitle || scoutName;
  currentEpisodeDesc  = scriptRes.episodeDescription || "";
  currentSeoMeta      = scriptRes.seoMeta || null;

  scriptTextArea.value = currentScript;
  scriptContainer.classList.remove("hidden");
  setStatus("scriptReady");
}

// ── History ──────────────────────────────────────────────────────
async function loadHistory() {
  const { podcastHistory = [] } = await chrome.storage.local.get(["podcastHistory"]);
  historyList.innerHTML = "";

  if (!podcastHistory.length) { historyEmpty.classList.remove("hidden"); return; }
  historyEmpty.classList.add("hidden");

  podcastHistory.forEach(entry => {
    const li = document.createElement("li");
    li.className = "history-item";

    const titleEl = document.createElement("div");
    titleEl.className = "history-title";
    titleEl.textContent = entry.title || "Untitled page";

    const metaEl = document.createElement("div");
    metaEl.className = "history-meta";
    const date   = entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString() : "";
    const source = entry.source === "manual" ? "Manual script" : (entry.url || "");
    metaEl.textContent = `${date}  ·  ${source}`;

    li.append(titleEl, metaEl);
    li.addEventListener("click", () => {
      if (!entry.script) return;
      currentScript = entry.script;
      currentPageTitle = entry.title || "Untitled page";
      currentPageUrl   = entry.url || "";
      pageTitleEl.textContent = currentPageTitle;
      scriptTextArea.value = currentScript;
      scriptContainer.classList.remove("hidden");
      switchTab("generate");
      setStatus("scriptReady", "Loaded a saved script. You can edit or generate audio.");
    });

    historyList.appendChild(li);
  });
}

// ── Settings management ──────────────────────────────────────────
function maskKey(key) {
  return key ? "••••••••" + key.slice(-4) : "";
}

function showSettingsStatus(msg, type = "info") {
  sStatusText.textContent = msg;
  sStatusText.className = "settings-status";
  if (type === "success") sStatusText.classList.add("success");
  if (type === "error")   sStatusText.classList.add("error");
}

async function loadSettingsForm() {
  const {
    geminiApiKey, openAiApiKey, ttsApiKey, elevenVoiceId, anthropicApiKey,
    ttsProvider, podcastName, hostName, targetLength, tone,
    podcastDescription, podcastCategory, episodeFormat, targetAudience, customSegments, episodeTemplate,
    sponsorLine,
    buzzsproutApiKey, buzzsproutPodcastId, buzzsproutPublishMode,
    yutoriApiKey, preferredModel,
    webAppUrl, webAppApiSecret
  } = await chrome.storage.sync.get([
    "geminiApiKey", "openAiApiKey", "ttsApiKey", "elevenVoiceId", "anthropicApiKey",
    "ttsProvider", "podcastName", "hostName", "targetLength", "tone",
    "podcastDescription", "podcastCategory", "episodeFormat", "targetAudience", "customSegments", "episodeTemplate",
    "sponsorLine",
    "buzzsproutApiKey", "buzzsproutPodcastId", "buzzsproutPublishMode",
    "yutoriApiKey", "preferredModel",
    "webAppUrl", "webAppApiSecret"
  ]);

  sGeminiHint.textContent    = geminiApiKey    ? "Stored: " + maskKey(geminiApiKey)    : "No key saved.";
  sOpenAiHint.textContent    = openAiApiKey    ? "Stored: " + maskKey(openAiApiKey)    : "No key saved.";
  sTtsHint.textContent       = ttsApiKey       ? "Stored: " + maskKey(ttsApiKey)       : "No key saved.";
  sAnthropicHint.textContent = anthropicApiKey ? "Stored: " + maskKey(anthropicApiKey) : "No key saved.";

  // Restore model selector preference
  if (preferredModel && modelSelect) modelSelect.value = preferredModel;

  if (elevenVoiceId) sElevenVoiceId.value = elevenVoiceId;
  if (ttsProvider)   sTtsProvider.value   = ttsProvider;
  if (targetLength)  {
    sLengthSelect.value = targetLength;
    sLengthHint.textContent = targetLength === "extralong"
      ? "⚠️ Audio may be cut off by TTS providers at this length. Works best with ElevenLabs paid plans."
      : "";
  }
  if (tone)          sToneSelect.value    = tone;

  // Podcast identity
  sSponsorLine.value     = sponsorLine     || "";
  sPodcastName.value     = podcastName     || "";
  sHostName.value        = hostName        || "";
  sPodcastDesc.value     = podcastDescription || "";
  sPodcastCategory.value = podcastCategory || "";
  sEpisodeFormat.value   = episodeFormat   || "solo";
  sTargetAudience.value  = targetAudience  || "";
  sCustomSegments.value  = customSegments   || "";
  sEpisodeTemplate.value = episodeTemplate  || "";

  // Yutori
  sYutoriKeyHint.textContent = yutoriApiKey
    ? "Stored: " + maskKey(yutoriApiKey)
    : "No key saved.";
  sYutoriKey.value = "";
  loadScoutSummary(yutoriApiKey).catch(() => {});

  // Buzzsprout
  sBuzzsproutKeyHint.textContent = buzzsproutApiKey
    ? "Stored: " + maskKey(buzzsproutApiKey)
    : "No key saved.";
  sBuzzsproutPodcastId.value  = buzzsproutPodcastId  || "";
  sBuzzsproutPublishMode.value= buzzsproutPublishMode || "draft";

  // Web App Sync
  if (sWebAppUrl)    sWebAppUrl.value    = webAppUrl    || "";
  if (sWebAppStatus) sWebAppStatus.textContent = webAppApiSecret
    ? "Connected — episodes will sync automatically."
    : "";

  // Clear sensitive input fields
  sGeminiKey.value     = "";
  sOpenAiKey.value     = "";
  sTtsKey.value        = "";
  sBuzzsproutKey.value = "";
  sAnthropicKey.value  = "";
}

async function saveKeys() {
  const geminiVal    = sGeminiKey.value.trim();
  const openAiVal    = sOpenAiKey.value.trim();
  const ttsVal       = sTtsKey.value.trim();
  const elevenVoice  = sElevenVoiceId.value.trim();
  const anthropicVal = sAnthropicKey.value.trim();

  if (!geminiVal && !openAiVal && !ttsVal && !elevenVoice && !anthropicVal) {
    showSettingsStatus("Enter at least one key to save.", "error");
    return;
  }

  const toSave = {};
  if (geminiVal)    toSave.geminiApiKey    = geminiVal;
  if (openAiVal)    toSave.openAiApiKey    = openAiVal;
  if (ttsVal)       toSave.ttsApiKey       = ttsVal;
  if (elevenVoice)  toSave.elevenVoiceId   = elevenVoice;
  if (anthropicVal) toSave.anthropicApiKey = anthropicVal;

  await chrome.storage.sync.set(toSave);
  await loadSettingsForm();
  showSettingsStatus("Keys saved.", "success");
}

async function clearKeys() {
  await chrome.storage.sync.remove(["geminiApiKey", "openAiApiKey", "ttsApiKey", "elevenVoiceId", "anthropicApiKey"]);
  await loadSettingsForm();
  showSettingsStatus("Keys cleared.", "success");
}

async function savePrefs() {
  await chrome.storage.sync.set({
    ttsProvider:  sTtsProvider.value,
    targetLength: sLengthSelect.value,
    tone:         sToneSelect.value
  });
  showSettingsStatus("Preferences saved.", "success");
}

async function saveIdentity() {
  await chrome.storage.sync.set({
    podcastName:         sPodcastName.value.trim(),
    hostName:            sHostName.value.trim(),
    podcastDescription:  sPodcastDesc.value.trim(),
    podcastCategory:     sPodcastCategory.value,
    episodeFormat:       sEpisodeFormat.value,
    targetAudience:      sTargetAudience.value.trim(),
    customSegments:      sCustomSegments.value.trim(),
    episodeTemplate:     sEpisodeTemplate.value.trim(),
    sponsorLine:         sSponsorLine.value.trim()
  });
  showSettingsStatus("Podcast identity saved.", "success");
}

async function loadScoutSummary(apiKey) {
  // Load auto-generate toggle state
  const { autoGenerate } = await chrome.storage.sync.get(["autoGenerate"]);
  sAutoGenerate.checked = !!autoGenerate;

  if (!apiKey) {
    sScoutSummary.classList.add("hidden");
    sCreateScoutSection.classList.remove("hidden");
    sScoutExistsNote.classList.add("hidden");
    return;
  }

  sScoutSummary.className = "scout-settings-summary";
  sScoutSummary.textContent = "Checking scouts…";

  try {
    const data = await yutoriFetch("/v1/scouting/tasks?page_size=50", apiKey);
    const list = Array.isArray(data.scouts) ? data.scouts : [];
    const active = list.filter(s => s.status !== "deleted" && s.status !== "archived");
    const count = active.length;

    // One-scout enforcement
    if (count >= 1) {
      sCreateScoutSection.classList.add("hidden");
      sScoutExistsNote.classList.remove("hidden");
    } else {
      sCreateScoutSection.classList.remove("hidden");
      sScoutExistsNote.classList.add("hidden");
    }

    if (count === 0) {
      sScoutSummary.innerHTML = "No scouts yet — create one below.";
    } else {
      const activeCount = active.filter(s => s.status === "active" || s.status === "running").length;
      const pausedCount = active.filter(s => s.status === "paused").length;
      const parts = [];
      if (activeCount) parts.push(`${activeCount} active`);
      if (pausedCount) parts.push(`${pausedCount} paused`);
      const detail = parts.length ? ` (${parts.join(", ")})` : "";
      sScoutSummary.innerHTML =
        `${count} scout${count === 1 ? "" : "s"}${detail} · <button id="sGoToScoutsTab" class="inline-link">View in Scouts tab →</button>`;
      document.getElementById("sGoToScoutsTab")?.addEventListener("click", () => {
        showView("main");
        switchTab("scouts");
      });
    }
  } catch (_) {
    sScoutSummary.textContent = "Could not load scout count.";
    sCreateScoutSection.classList.remove("hidden");
    sScoutExistsNote.classList.add("hidden");
  }
}

async function saveYutori() {
  const keyVal = sYutoriKey.value.trim();
  if (!keyVal) { showSettingsStatus("Enter your Yutori API key.", "error"); return; }
  await chrome.storage.sync.set({ yutoriApiKey: keyVal });
  await loadSettingsForm();
  showSettingsStatus("Yutori key saved.", "success");
}

async function clearYutori() {
  await chrome.storage.sync.remove(["yutoriApiKey"]);
  await loadSettingsForm();
  showSettingsStatus("Yutori key cleared.", "success");
}

async function createScout() {
  const { yutoriApiKey } = await chrome.storage.sync.get(["yutoriApiKey"]);
  if (!yutoriApiKey) {
    sCreateScoutStatus.textContent = "Save your Yutori API key first.";
    sCreateScoutStatus.className = "settings-status error";
    return;
  }

  const query    = sScoutQuery.value.trim();
  const interval = parseInt(sScoutInterval.value, 10);

  if (!query) {
    sCreateScoutStatus.textContent = "Enter a research query.";
    sCreateScoutStatus.className = "settings-status error";
    return;
  }

  setBtnLoading(sCreateScoutBtn, true, "Creating…");
  sCreateScoutStatus.textContent = "";
  sCreateScoutStatus.className = "settings-status";

  try {
    const res = await fetch("https://api.yutori.com/v1/scouting/tasks", {
      method: "POST",
      headers: {
        "X-API-Key": yutoriApiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, output_interval: interval })
    });

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const b = await res.json(); msg = b.detail || b.message || JSON.stringify(b) || msg; } catch (_) {}
      throw new Error(msg);
    }

    await res.json();
    sCreateScoutStatus.textContent = "Scout created! Check the Scouts tab.";
    sCreateScoutStatus.className = "settings-status success";
    sScoutQuery.value = "";
    const { yutoriApiKey: k } = await chrome.storage.sync.get(["yutoriApiKey"]);
    loadScoutSummary(k).catch(() => {});
  } catch (err) {
    console.error("Create scout error", err);
    sCreateScoutStatus.textContent = "Failed to create scout: " + (err.message || "Unknown error");
    sCreateScoutStatus.className = "settings-status error";
  } finally {
    setBtnLoading(sCreateScoutBtn, false);
  }
}

async function saveBuzzsprout() {
  const keyVal      = sBuzzsproutKey.value.trim();
  const podcastIdVal= sBuzzsproutPodcastId.value.trim();

  if (!keyVal && !podcastIdVal) {
    showSettingsStatus("Enter your API key and Podcast ID.", "error");
    return;
  }

  const toSave = { buzzsproutPublishMode: sBuzzsproutPublishMode.value };
  if (keyVal)       toSave.buzzsproutApiKey    = keyVal;
  if (podcastIdVal) toSave.buzzsproutPodcastId = podcastIdVal;

  await chrome.storage.sync.set(toSave);
  await loadSettingsForm();
  showSettingsStatus("Publishing settings saved.", "success");
}

async function clearBuzzsprout() {
  await chrome.storage.sync.remove(["buzzsproutApiKey", "buzzsproutPodcastId", "buzzsproutPublishMode"]);
  await loadSettingsForm();
  showSettingsStatus("Publishing settings cleared.", "success");
}

async function saveWebApp() {
  const urlVal    = sWebAppUrl?.value.trim();
  const secretVal = sWebAppSecret?.value.trim();
  if (!urlVal || !secretVal) {
    if (sWebAppStatus) { sWebAppStatus.textContent = "Enter both URL and API secret."; sWebAppStatus.className = "settings-status error"; }
    return;
  }
  await chrome.storage.sync.set({ webAppUrl: urlVal, webAppApiSecret: secretVal });
  if (sWebAppSecret) sWebAppSecret.value = "";
  await loadSettingsForm();
  if (sWebAppStatus) { sWebAppStatus.textContent = "Saved — episodes will sync automatically."; sWebAppStatus.className = "settings-status success"; }
}

async function clearWebApp() {
  await chrome.storage.sync.remove(["webAppUrl", "webAppApiSecret"]);
  await loadSettingsForm();
  if (sWebAppStatus) { sWebAppStatus.textContent = "Web app sync cleared."; sWebAppStatus.className = "settings-status"; }
}

// ── Buzzsprout publish flow ──────────────────────────────────────
function showPublishResult(type, html) {
  publishResult.innerHTML = html;
  publishResult.className = "publish-result " + type;
  publishResult.classList.remove("hidden");
}

async function handlePublish() {
  if (!audioBlob) {
    showPublishResult("error", "No audio to publish. Generate audio first.");
    return;
  }

  const { buzzsproutApiKey, buzzsproutPodcastId, buzzsproutPublishMode, hostName, podcastCategory } =
    await chrome.storage.sync.get([
      "buzzsproutApiKey", "buzzsproutPodcastId", "buzzsproutPublishMode",
      "hostName", "podcastCategory"
    ]);

  if (!buzzsproutApiKey || !buzzsproutPodcastId) {
    showPublishResult("error", "Add your Buzzsprout API key and Podcast ID in Settings.");
    return;
  }

  setBtnLoading(publishBtn, true, "Publishing…");
  publishResult.classList.add("hidden");

  try {
    const episodeTitle   = episodeTitleField.value.trim() || currentEpisodeTitle || "Untitled Episode";
    const descriptionText= episodeDescField.value.trim() || currentEpisodeDesc || "";

    // Determine published_at: draft = far future date, published = now
    const publishedAt = buzzsproutPublishMode === "published"
      ? new Date().toISOString()
      : ""; // empty = draft in Buzzsprout

    const formData = new FormData();
    formData.append("title",       episodeTitle);
    formData.append("audio_file",  audioBlob, "episode.mp3");
    formData.append("description", descriptionText);
    if (hostName)      formData.append("artist", hostName);
    if (podcastCategory) formData.append("tags", podcastCategory);
    if (publishedAt)   formData.append("published_at", publishedAt);

    const res = await fetch(
      `https://www.buzzsprout.com/api/${buzzsproutPodcastId}/episodes.json`,
      {
        method: "POST",
        headers: { Authorization: "Token token=" + buzzsproutApiKey },
        body: formData
      }
    );

    if (!res.ok) {
      let msg = "HTTP " + res.status;
      try {
        const body = await res.json();
        msg = body.error || body.message || JSON.stringify(body) || msg;
      } catch (_) { /* ignore */ }
      throw new Error(msg);
    }

    const episode = await res.json();
    const episodeUrl = episode.audio_url || "";
    const dashboardUrl = `https://www.buzzsprout.com/${buzzsproutPodcastId}/episodes/${episode.id}`;
    const modeLabel = buzzsproutPublishMode === "published" ? "Published" : "Saved as draft";

    showPublishResult(
      "success",
      `${modeLabel} · <a href="${dashboardUrl}" target="_blank" rel="noopener">View episode in Buzzsprout →</a>`
    );

    publishBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      ${modeLabel}
    `;
    publishBtn.disabled = true;

  } catch (err) {
    console.error("Buzzsprout publish error", err);
    showPublishResult("error", "Publish failed: " + (err.message || "Unknown error"));
    setBtnLoading(publishBtn, false);
  }
}

// ── Init ─────────────────────────────────────────────────────────
async function init() {
  const keysPresent = await hasKeys();
  currentPageTitle  = await detectPageTitle();
  pageTitleEl.textContent = currentPageTitle;
  showView(keysPresent ? "main" : "onboarding");
  if (keysPresent) setStatus("idle");
}

// ── Event listeners ──────────────────────────────────────────────
generateBtn.addEventListener("click",        () => handleGenerateScript());
generateAudioBtn.addEventListener("click",   () => handleGenerateAudio());
regenerateScriptBtn.addEventListener("click",() => handleGenerateScript());
downloadBtn.addEventListener("click",        () => handleDownload());
tabGenerate.addEventListener("click",        () => switchTab("generate"));
tabScript.addEventListener("click",          () => switchTab("script"));
tabScouts.addEventListener("click",          () => switchTab("scouts"));
tabHistory.addEventListener("click",         () => switchTab("history"));

scoutsRefreshBtn.addEventListener("click",   () => loadScouts().catch(console.error));
scoutsGoToSettings.addEventListener("click", () => showView("settings"));
scoutBackBtn.addEventListener("click",       () => { activeScoutData = null; scoutsShowState("list"); });
scoutGenerateBtn.addEventListener("click",   () =>
  handleScoutGenerate().catch(err => { console.error(err); showError("Scout generation failed: " + err.message); })
);

customScriptInput.addEventListener("input",  () => updateWordCount());
customGenerateMetaBtn.addEventListener("click", async () => {
  const script = customScriptInput.value.trim();
  if (!script) { showCustomError("Paste a script first, then generate title & description."); return; }
  showCustomError("");
  customGenerateMetaBtn.disabled = true;
  customGenerateMetaBtn.textContent = "Generating…";
  const res = await requestEpisodeMeta(script).catch(() => null);
  customGenerateMetaBtn.disabled = false;
  customGenerateMetaBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> AI fill`;
  if (res?.ok) {
    if (res.episodeTitle)       customEpisodeTitle.value = res.episodeTitle;
    if (res.episodeDescription) customEpisodeDesc.value  = res.episodeDescription;
  } else {
    showCustomError(res?.error || "Could not generate metadata. Check your Gemini key.");
  }
});
customScriptClear.addEventListener("click",  () => {
  customEpisodeTitle.value = "";
  customEpisodeDesc.value  = "";
  customScriptInput.value  = "";
  updateWordCount();
  customDownloadSection.classList.add("hidden");
  customPublishResult.classList.add("hidden");
  showCustomError("");
  if (customAudioPlayer.src) { URL.revokeObjectURL(customAudioPlayer.src); customAudioPlayer.src = ""; }
  customAudioBlob = null;
});
customScriptAudioBtn.addEventListener("click", () =>
  handleCustomGenerateAudio().catch(err => { console.error(err); showCustomError("Something went wrong. Try again."); })
);
customDownloadBtn.addEventListener("click",  () => handleCustomDownload());
customPublishBtn.addEventListener("click",   () =>
  handleCustomPublish().catch(err => { console.error(err); showCustomPublishResult("error", "Publish failed: " + (err.message || "Unknown error")); setBtnLoading(customPublishBtn, false); })
);

settingsBtn.addEventListener("click", () => showView("settings"));
openSettingsFromOnboarding.addEventListener("click", () => showView("settings"));
settingsBackBtn.addEventListener("click", () => {
  showSettingsStatus("", "info");
  init();
});

sSaveKeysBtn.addEventListener("click",       () => saveKeys().catch(err        => { console.error(err); showSettingsStatus("Failed to save keys.", "error"); }));
sClearKeysBtn.addEventListener("click",      () => clearKeys().catch(err       => { console.error(err); showSettingsStatus("Failed to clear keys.", "error"); }));
sSavePrefsBtn.addEventListener("click",      () => savePrefs().catch(err       => { console.error(err); showSettingsStatus("Failed to save preferences.", "error"); }));
sLengthSelect.addEventListener("change",     () => {
  sLengthHint.textContent = sLengthSelect.value === "extralong"
    ? "⚠️ Audio may be cut off by TTS providers at this length. Works best with ElevenLabs paid plans."
    : "";
});
sSaveIdentityBtn.addEventListener("click",   () => saveIdentity().catch(err    => { console.error(err); showSettingsStatus("Failed to save identity.", "error"); }));
sSaveYutoriBtn.addEventListener("click",     () => saveYutori().catch(err      => { console.error(err); showSettingsStatus("Failed to save Yutori key.", "error"); }));
sClearYutoriBtn.addEventListener("click",    () => clearYutori().catch(err     => { console.error(err); showSettingsStatus("Failed to clear Yutori key.", "error"); }));
sCreateScoutBtn.addEventListener("click",    () => createScout().catch(err     => { console.error(err); sCreateScoutStatus.textContent = "Failed: " + (err.message || "Unknown error"); sCreateScoutStatus.className = "settings-status error"; }));

sAutoGenerate.addEventListener("change", async () => {
  const enabled = sAutoGenerate.checked;
  await chrome.storage.sync.set({ autoGenerate: enabled });
  chrome.runtime.sendMessage({ type: enabled ? "AUTO_GENERATE_START" : "AUTO_GENERATE_STOP" }).catch(() => {});
  showSettingsStatus(enabled ? "Auto-generate enabled." : "Auto-generate disabled.", "success");
});
sSaveBuzzsproutBtn.addEventListener("click", () => saveBuzzsprout().catch(err  => { console.error(err); showSettingsStatus("Failed to save publishing settings.", "error"); }));
sClearBuzzsproutBtn.addEventListener("click",() => clearBuzzsprout().catch(err => { console.error(err); showSettingsStatus("Failed to clear publishing settings.", "error"); }));
sSaveWebAppBtn?.addEventListener("click",    () => saveWebApp().catch(err       => { console.error(err); if (sWebAppStatus) { sWebAppStatus.textContent = "Failed to save."; sWebAppStatus.className = "settings-status error"; } }));
sClearWebAppBtn?.addEventListener("click",   () => clearWebApp().catch(err      => { console.error(err); }));
publishBtn.addEventListener("click",         () => handlePublish().catch(err   => { console.error(err); showPublishResult("error", "Publish failed: " + (err.message || "Unknown error")); setBtnLoading(publishBtn, false); }));

modelSelect.addEventListener("change", () => {
  chrome.storage.sync.set({ preferredModel: modelSelect.value });
});

// Live status updates pushed from background during script generation
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "STATUS_UPDATE" && msg.message) {
    setStatus("scriptGenerating", msg.message);
  }
});

init().catch(err => {
  console.error("Popup init error", err);
  showError("Failed to initialize. Try reopening the panel.");
});
