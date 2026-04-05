function extractMainContent() {
  const root =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.body;

  if (!root) {
    return {
      title: document.title || "Untitled Page",
      text: ""
    };
  }

  const blocks = root.querySelectorAll("h1, h2, h3, p, li");
  const parts = [];

  blocks.forEach(el => {
    const text = el.innerText.trim();
    if (text.length > 0) {
      parts.push(text);
    }
  });

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

