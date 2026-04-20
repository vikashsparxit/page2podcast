# Plan: fix-audio-download

**What:** Downloaded audio file is 15 bytes / silent — fix Blob transfer between background service worker and popup
**When:** 2026-04-02

---

## Root Cause

`Blob` objects are **not structured-cloneable** across the Chrome extension message channel (background service worker → popup). When `sendResponse({ ok: true, blob })` is called in `background.js`, Chrome silently serializes the Blob as an empty object `{}`. The audio was fetched from the API successfully — it just can't travel through `chrome.runtime.sendMessage`.

The fix is to convert the Blob to an `ArrayBuffer` (which IS structured-cloneable) before sending, then reconstruct the Blob in the popup.

---

## Scope

**Building:**
- Convert Blob → ArrayBuffer in `background.js` before `sendResponse`
- Reconstruct Blob from ArrayBuffer in `popup.js` after `sendResponse`
- Pass MIME type alongside the buffer so the Blob is typed correctly

**NOT Building:**
- No streaming changes — both APIs already buffer fully before we receive the data
- No chrome.downloads API migration
- No base64 encoding (less efficient, unnecessary)
- No changes to Gemini script generation path

---

## Phases

### Phase 1: Fix Blob → ArrayBuffer transfer
**Goal:** Audio bytes travel intact from background → popup

Tasks:
- [ ] In `background.js` `GENERATE_TTS_AUDIO` handler: call `blob.arrayBuffer()` and send `{ ok: true, buffer: arrayBuffer, mimeType: blob.type }` instead of `{ ok: true, blob }`
- [ ] In `popup.js` `requestTtsAudio`: reconstruct `new Blob([res.buffer], { type: res.mimeType || 'audio/mpeg' })` and set `audioBlob`
- [ ] In `popup.js` `handleGenerateAudio`: update guard to check `res.buffer` instead of `res.blob`

Validation:
- [ ] Load extension unpacked in Chrome
- [ ] Generate a script, click "Generate Audio" — no error shown
- [ ] Click Download — file downloads and is larger than 1 KB
- [ ] Open the downloaded MP3 — audio plays correctly

---

## Acceptance Criteria

- [ ] Downloaded file is a valid MP3 (opens in any media player)
- [ ] Downloaded file size reflects actual audio content (typically 500 KB – 5 MB depending on script length)
- [ ] Works for both OpenAI TTS and ElevenLabs providers
- [ ] Error handling unchanged — API errors still surface to the user
- [ ] No regressions in script generation or history tab

---

## Technical Notes

**Approach:** Structured-clone boundary workaround — convert non-cloneable Blob to cloneable ArrayBuffer before crossing the message channel, reconstruct on the other side.

**Files:**
- Modify: `background.js` — lines 405–418 (`GENERATE_TTS_AUDIO` handler)
- Modify: `popup.js` — `requestTtsAudio` return handling + `handleGenerateAudio` guard

**Why ArrayBuffer over base64:** ArrayBuffer transfers binary as-is with no encoding overhead. Podcast audio can be 2–5 MB; base64 would inflate that by ~33%.

---

## Risks & Mitigations

| Risk | Plan |
|------|------|
| `blob.arrayBuffer()` is async — service worker might time out on very long audio | Both OpenAI and ElevenLabs already complete fully before we call `arrayBuffer()`, so the await adds negligible time |
| `res.buffer` arrives as plain object (not ArrayBuffer) if Chrome re-serializes | Wrap in `new Uint8Array(Object.values(res.buffer)).buffer` as fallback in popup |
| MIME type missing from response | Default to `audio/mpeg` if `res.mimeType` is empty |
