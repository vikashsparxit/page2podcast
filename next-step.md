## Next Steps for Reliable TTS in Page2Podcast

This document captures the recommended path forward for fixing the 15-byte audio issue and making TTS robust. We can revisit and implement this later.

### 1. Move TTS to a Tiny Backend Service

Browser-only calls to ElevenLabs / OpenAI TTS have been unreliable (0-byte or 15-byte audio files) and are hard to debug. The next step is to move TTS into a minimal backend where we fully control and can inspect HTTP traffic.

- **Suggested stack**: Node.js (Express or Fastify) or Python (FastAPI / Flask).
- **Endpoints**:
  - `POST /tts/openai` – accepts `{ script, voice, model }`, calls OpenAI `POST /v1/audio/speech`, returns raw audio (`audio/mpeg`).
  - `POST /tts/elevenlabs` (optional) – same idea for ElevenLabs.
- **Security**:
  - Store API keys on the server (env vars or secret manager), not in the extension.
  - Use a simple auth token between extension and backend if needed.

Once this exists, the extension only:

- Sends the script text + minimal metadata to the backend.
- Receives either:
  - A direct `audio/mpeg` response to stream/download, or
  - A signed URL/path to a stored file (e.g., S3, GCS) to download.

### 2. Log and Inspect Raw TTS Responses

In the backend, for each TTS call:

- Log:
  - Request body (without secrets).
  - Full response headers.
  - Response status + `Content-Type` + `Content-Length`.
- For debugging, temporarily write the exact response body to disk before any processing.

This will make it clear whether:

- The provider is actually returning 0 bytes, or
- The issue was in our previous browser handling path (ArrayBuffer, Blob, messaging).

### 3. Simplify Extension’s Audio Handling

After moving TTS server-side:

- Replace current `GENERATE_TTS_AUDIO` logic with:
  - `fetch` to backend `/tts/...`.
  - Treat response as a normal `Blob` and download it.
- Remove provider-specific error handling from the extension; just surface backend error messages.

### 4. Optionally Support Multiple Providers via Backend

Once a backend exists, supporting additional TTS providers (Google Cloud TTS, Coqui TTS, etc.) is straightforward:

- Add provider-specific modules on the server.
- Use a `provider` parameter from the extension, or server-side config, to route calls.

---

When we revisit this, the first concrete action should be: **create a minimal backend with one `/tts/openai` route, wire the extension to it, and confirm we get full-length audio files.** Everything else can then be iterated from there.

