const geminiKeyInput = document.getElementById("geminiKey");
const ttsKeyInput = document.getElementById("ttsKey");
const openAiKeyInput = document.getElementById("openAiKey");
const geminiHint = document.getElementById("geminiHint");
const ttsHint = document.getElementById("ttsHint");
const openAiHint = document.getElementById("openAiHint");

const voiceSelect = document.getElementById("voiceSelect");
const lengthSelect = document.getElementById("lengthSelect");
const toneSelect = document.getElementById("toneSelect");

const elevenVoiceIdInput = document.getElementById("elevenVoiceId");

const podcastNameInput = document.getElementById("podcastName");
const hostNameInput = document.getElementById("hostName");

const ttsProviderSelect = document.getElementById("ttsProvider");

const saveKeysBtn = document.getElementById("saveKeysBtn");
const clearKeysBtn = document.getElementById("clearKeysBtn");
const savePrefsBtn = document.getElementById("savePrefsBtn");

const statusText = document.getElementById("statusText");

function maskKey(key) {
  if (!key) return "";
  const visible = key.slice(-4);
  return "••••••••" + visible;
}

function setStatus(message, type = "info") {
  statusText.textContent = message;
  statusText.classList.remove("success", "error");
  if (type === "success") statusText.classList.add("success");
  if (type === "error") statusText.classList.add("error");
}

async function loadSettings() {
  const {
    geminiApiKey,
    ttsApiKey,
    openAiApiKey,
    elevenVoiceId,
    podcastName,
    hostName,
    defaultVoice,
    targetLength,
    tone,
    ttsProvider
  } = await chrome.storage.sync.get([
    "geminiApiKey",
    "ttsApiKey",
    "openAiApiKey",
    "elevenVoiceId",
    "podcastName",
    "hostName",
    "defaultVoice",
    "targetLength",
    "tone",
    "ttsProvider"
  ]);

  if (geminiApiKey) {
    geminiHint.textContent = "Stored key: " + maskKey(geminiApiKey);
  } else {
    geminiHint.textContent = "No Gemini key saved.";
  }

  if (ttsApiKey) {
    ttsHint.textContent = "Stored ElevenLabs key: " + maskKey(ttsApiKey);
  } else {
    ttsHint.textContent = "No ElevenLabs key saved.";
  }

  if (openAiApiKey) {
    openAiHint.textContent = "Stored OpenAI key: " + maskKey(openAiApiKey);
  } else {
    openAiHint.textContent = "No OpenAI key saved.";
  }

  if (elevenVoiceId) {
    elevenVoiceIdInput.value = elevenVoiceId;
  }

  if (podcastName) {
    podcastNameInput.value = podcastName;
  }
  if (hostName) {
    hostNameInput.value = hostName;
  }

  if (defaultVoice) {
    voiceSelect.value = defaultVoice;
  }
  if (targetLength) {
    lengthSelect.value = targetLength;
  }
  if (tone) {
    toneSelect.value = tone;
  }

  if (ttsProvider) {
    ttsProviderSelect.value = ttsProvider;
  }
}

async function saveKeys() {
  const geminiApiKey = geminiKeyInput.value.trim();
  const ttsApiKey = ttsKeyInput.value.trim();
  const openAiApiKey = openAiKeyInput.value.trim();
  const elevenVoiceId = elevenVoiceIdInput.value.trim();
  const podcastName = podcastNameInput.value.trim();
  const hostName = hostNameInput.value.trim();

  if (!geminiApiKey) {
    setStatus("Gemini API key is required.", "error");
    return;
  }

  if (!openAiApiKey && !ttsApiKey) {
    setStatus("At least one TTS key (OpenAI or ElevenLabs) is required.", "error");
    return;
  }

  if (!podcastName || !hostName) {
    setStatus("Podcast name and host name are required.", "error");
    return;
  }

  await chrome.storage.sync.set({
    geminiApiKey,
    ttsApiKey,
    openAiApiKey,
    elevenVoiceId,
    podcastName,
    hostName
  });
  geminiKeyInput.value = "";
  ttsKeyInput.value = "";
  await loadSettings();
  setStatus("API keys saved. You can now use the extension.", "success");
}

async function clearKeys() {
  await chrome.storage.sync.remove([
    "geminiApiKey",
    "ttsApiKey",
    "openAiApiKey",
    "elevenVoiceId"
  ]);
  await loadSettings();
  setStatus("Keys cleared. Add new keys to continue using the extension.", "success");
}

async function savePreferences() {
  const defaultVoice = voiceSelect.value;
  const targetLength = lengthSelect.value;
  const tone = toneSelect.value;
  const ttsProvider = ttsProviderSelect.value;

  await chrome.storage.sync.set({
    defaultVoice,
    targetLength,
    tone,
    ttsProvider
  });

  setStatus("Preferences saved.", "success");
}

saveKeysBtn.addEventListener("click", () => {
  saveKeys().catch(err => {
    console.error("Save keys error", err);
    setStatus("Failed to save keys. Try again.", "error");
  });
});

clearKeysBtn.addEventListener("click", () => {
  clearKeys().catch(err => {
    console.error("Clear keys error", err);
    setStatus("Failed to clear keys. Try again.", "error");
  });
});

savePrefsBtn.addEventListener("click", () => {
  savePreferences().catch(err => {
    console.error("Save prefs error", err);
    setStatus("Failed to save preferences. Try again.", "error");
  });
});

loadSettings().catch(err => {
  console.error("Load settings error", err);
  setStatus("Failed to load current settings.", "error");
});

