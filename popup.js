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
const tabHistory   = document.getElementById("tabHistory");
const generateView = document.getElementById("generateView");
const historyView  = document.getElementById("historyView");
const historyList  = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");

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

// ── State ────────────────────────────────────────────────────────
let currentScript    = "";
let currentPageTitle = "";
let currentPageUrl   = "";
let audioBlob        = null;
let previousView     = "main"; // "main" | "onboarding"

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
  if (tab === "history") {
    tabHistory.classList.add("active");
    tabGenerate.classList.remove("active");
    historyView.classList.remove("hidden");
    generateView.classList.add("hidden");
    loadHistory().catch(console.error);
  } else {
    tabGenerate.classList.add("active");
    tabHistory.classList.remove("active");
    generateView.classList.remove("hidden");
    historyView.classList.add("hidden");
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
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      { type: "GENERATE_PODCAST_SCRIPT", payload: { title, text, pageUrl } },
      response => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: "Could not reach background script. Try reopening the panel." });
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
  downloadSection.classList.add("hidden");
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

  currentScript = scriptRes.script;
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

  downloadSection.classList.remove("hidden");
  setStatus("finalizing");
}

function handleDownload() {
  if (!audioBlob) { showError("No audio available to download yet."); return; }
  downloadBlobAsFile(audioBlob, buildFilenameFromTitle(currentPageTitle), "audio/mpeg");
  setStatus("done");
}

// ── History ──────────────────────────────────────────────────────
async function loadHistory() {
  const { podcastHistory = [] } = await chrome.storage.session.get(["podcastHistory"]);
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
    const date = entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString() : "";
    metaEl.textContent = `${date}  ·  ${entry.url || ""}`;

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
    geminiApiKey, openAiApiKey, ttsApiKey, elevenVoiceId,
    ttsProvider, podcastName, hostName, targetLength, tone
  } = await chrome.storage.sync.get([
    "geminiApiKey", "openAiApiKey", "ttsApiKey", "elevenVoiceId",
    "ttsProvider", "podcastName", "hostName", "targetLength", "tone"
  ]);

  sGeminiHint.textContent  = geminiApiKey ? "Stored: " + maskKey(geminiApiKey)     : "No key saved.";
  sOpenAiHint.textContent  = openAiApiKey ? "Stored: " + maskKey(openAiApiKey)     : "No key saved.";
  sTtsHint.textContent     = ttsApiKey    ? "Stored: " + maskKey(ttsApiKey)        : "No key saved.";

  if (elevenVoiceId) sElevenVoiceId.value = elevenVoiceId;
  if (ttsProvider)   sTtsProvider.value   = ttsProvider;
  if (podcastName)   sPodcastName.value   = podcastName;
  if (hostName)      sHostName.value      = hostName;
  if (targetLength)  sLengthSelect.value  = targetLength;
  if (tone)          sToneSelect.value    = tone;

  // Clear sensitive input fields
  sGeminiKey.value = "";
  sOpenAiKey.value = "";
  sTtsKey.value    = "";
}

async function saveKeys() {
  const geminiVal    = sGeminiKey.value.trim();
  const openAiVal    = sOpenAiKey.value.trim();
  const ttsVal       = sTtsKey.value.trim();
  const elevenVoice  = sElevenVoiceId.value.trim();
  const podcastName  = sPodcastName.value.trim();
  const hostName     = sHostName.value.trim();

  if (!geminiVal && !openAiVal && !ttsVal && !elevenVoice && !podcastName && !hostName) {
    showSettingsStatus("Enter at least one value to save.", "error");
    return;
  }

  const toSave = {};
  if (geminiVal)   toSave.geminiApiKey   = geminiVal;
  if (openAiVal)   toSave.openAiApiKey   = openAiVal;
  if (ttsVal)      toSave.ttsApiKey      = ttsVal;
  if (elevenVoice) toSave.elevenVoiceId  = elevenVoice;
  if (podcastName) toSave.podcastName    = podcastName;
  if (hostName)    toSave.hostName       = hostName;

  await chrome.storage.sync.set(toSave);
  await loadSettingsForm();
  showSettingsStatus("Keys saved.", "success");
}

async function clearKeys() {
  await chrome.storage.sync.remove(["geminiApiKey", "openAiApiKey", "ttsApiKey", "elevenVoiceId"]);
  await loadSettingsForm();
  showSettingsStatus("Keys cleared.", "success");
}

async function savePrefs() {
  await chrome.storage.sync.set({
    ttsProvider:  sTtsProvider.value,
    podcastName:  sPodcastName.value.trim(),
    hostName:     sHostName.value.trim(),
    targetLength: sLengthSelect.value,
    tone:         sToneSelect.value
  });
  showSettingsStatus("Preferences saved.", "success");
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
tabHistory.addEventListener("click",         () => switchTab("history"));

settingsBtn.addEventListener("click", () => showView("settings"));
openSettingsFromOnboarding.addEventListener("click", () => showView("settings"));
settingsBackBtn.addEventListener("click", () => {
  showSettingsStatus("", "info");
  init();
});

sSaveKeysBtn.addEventListener("click",  () => saveKeys().catch(err  => { console.error(err); showSettingsStatus("Failed to save keys.", "error"); }));
sClearKeysBtn.addEventListener("click", () => clearKeys().catch(err => { console.error(err); showSettingsStatus("Failed to clear keys.", "error"); }));
sSavePrefsBtn.addEventListener("click", () => savePrefs().catch(err => { console.error(err); showSettingsStatus("Failed to save preferences.", "error"); }));

init().catch(err => {
  console.error("Popup init error", err);
  showError("Failed to initialize. Try reopening the panel.");
});
