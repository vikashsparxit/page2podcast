function extractMainContent() {
  const url = location.href;

  // ── Google Docs ───────────────────────────────────────────────
  // Docs renders into a canvas-based editor; normal DOM selectors get nothing.
  // Text lives in .kix-paragraphrenderer spans inside the editor.
  if (url.includes("docs.google.com/document")) {
    const paragraphs = document.querySelectorAll(".kix-paragraphrenderer");
    if (paragraphs.length > 0) {
      const parts = [];
      paragraphs.forEach(p => {
        const text = p.innerText.trim();
        if (text) parts.push(text);
      });
      const text = parts.join("\n\n");
      if (text.trim()) {
        return { title: document.title.replace(" - Google Docs", "").trim(), text };
      }
    }
    // Fallback: grab all visible text from the editor container
    const editor = document.getElementById("docs-editor") ||
                   document.querySelector(".docs-content-outer-container");
    if (editor) {
      const text = editor.innerText.trim();
      if (text) {
        return { title: document.title.replace(" - Google Docs", "").trim(), text };
      }
    }
  }

  // ── Google Sheets ─────────────────────────────────────────────
  if (url.includes("docs.google.com/spreadsheets")) {
    return {
      title: document.title.replace(" - Google Sheets", "").trim(),
      text: "Google Sheets content cannot be extracted directly. Copy the relevant cells and use the Script tab to paste and generate audio."
    };
  }

  // ── Markdown / raw text pages (e.g. Scouts artifacts, GitHub raw, .md viewers) ──
  // These render content inside <pre>, <code>, or a plain text body.
  const isProbablyMarkdown =
    url.match(/\.(md|txt)$/) ||
    url.includes("/artifacts/") ||
    url.includes("raw.githubusercontent.com") ||
    document.contentType === "text/plain";

  if (isProbablyMarkdown) {
    // Try <pre> first (most markdown viewers and raw pages use this)
    const pre = document.querySelector("pre");
    if (pre && pre.innerText.trim().length > 100) {
      return {
        title: document.title || url.split("/").pop() || "Document",
        text: pre.innerText.trim()
      };
    }
    // Fall through to generic extraction — markdown may be rendered as HTML
  }

  // ── Generic extraction ────────────────────────────────────────
  // Try semantic containers first, then widen progressively.
  const root =
    document.querySelector("article") ||
    document.querySelector('[role="main"]') ||
    document.querySelector("main") ||
    document.querySelector(".content, .post-content, .entry-content, .article-body") ||
    document.body;

  if (!root) {
    return { title: document.title || "Untitled Page", text: "" };
  }

  // Clone so we can strip noise without touching the live DOM
  const clone = root.cloneNode(true);

  // Remove elements that never contain useful content
  const noise = clone.querySelectorAll(
    "nav, header, footer, aside, script, style, noscript, " +
    "[role='navigation'], [role='banner'], [role='complementary'], " +
    ".nav, .navbar, .menu, .sidebar, .ads, .advertisement, " +
    ".cookie-notice, .popup, .modal, .share-buttons, .social-links"
  );
  noise.forEach(el => el.remove());

  // Collect meaningful text nodes: headings, paragraphs, list items,
  // table cells, and pre/code blocks (catches markdown viewers, Scouts reports, etc.)
  const blocks = clone.querySelectorAll("h1, h2, h3, h4, p, li, td, th, pre, code, blockquote, dt, dd");
  const parts = [];
  const seen = new Set();

  blocks.forEach(el => {
    // Skip <code> inside <pre> to avoid double-counting
    if (el.tagName === "CODE" && el.closest("pre")) return;

    const text = el.innerText.trim();
    if (text.length < 15) return;        // skip tiny fragments
    if (seen.has(text)) return;          // skip duplicates
    seen.add(text);
    parts.push(text);
  });

  // If semantic blocks yielded nothing meaningful, fall back to full body text
  if (parts.length === 0 || parts.join("").length < 200) {
    const bodyText = (clone.innerText || "").trim();
    if (bodyText.length > 200) {
      return { title: document.title || "Untitled Page", text: bodyText };
    }
  }

  return {
    title: document.title || "Untitled Page",
    text: parts.join("\n\n")
  };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "EXTRACT_PAGE") {
    try {
      const result = extractMainContent();
      sendResponse({ ok: true, ...result });
    } catch (err) {
      console.error("Content extraction error", err);
      sendResponse({
        ok: false,
        error: "Failed to extract content from this page."
      });
    }
    return true;
  }

  return false;
});
