// Shared web app auth helpers for popup + background service worker.

export async function getWebAppSession() {
  const { webAppSession } = await chrome.storage.local.get(["webAppSession"]);
  if (!webAppSession?.access_token) return null;

  const now = Math.floor(Date.now() / 1000);
  if (webAppSession.expires_at && now < webAppSession.expires_at - 60) {
    return webAppSession;
  }

  return refreshWebAppSession(webAppSession);
}

async function refreshWebAppSession(session) {
  const supabaseUrl = session.supabase_url;
  const anonKey = session.anon_key;
  if (!supabaseUrl || !anonKey || !session.refresh_token) {
    await chrome.storage.local.remove(["webAppSession"]);
    return null;
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!res.ok) throw new Error("refresh failed");

    const data = await res.json();
    const updated = {
      ...session,
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? session.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
    };
    await chrome.storage.local.set({ webAppSession: updated });
    return updated;
  } catch {
    await chrome.storage.local.remove(["webAppSession"]);
    return null;
  }
}

export async function signInToWebApp(webAppUrl) {
  if (!webAppUrl) throw new Error("Web app URL is required");

  const redirectUri = chrome.identity.getRedirectURL();
  const authUrl =
    `${webAppUrl.replace(/\/$/, "")}/auth/extension?redirect_uri=${encodeURIComponent(redirectUri)}`;

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  });

  const hash = new URL(responseUrl).hash.slice(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) {
    throw new Error("Sign-in cancelled or failed");
  }

  const session = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: parseInt(params.get("expires_at") || "0", 10) || Math.floor(Date.now() / 1000) + 3600,
    email: params.get("email") || "",
    supabase_url: params.get("supabase_url") || "",
    anon_key: params.get("anon_key") || "",
  };

  await chrome.storage.local.set({ webAppSession: session });
  return session;
}

export async function signOutWebApp() {
  await chrome.storage.local.remove(["webAppSession"]);
}

export async function claimOrphanedEpisodes(webAppUrl, session) {
  const { podcastHistory = [] } = await chrome.storage.local.get(["podcastHistory"]);
  const extensionIds = podcastHistory.map((entry) => String(entry.id)).filter(Boolean);
  if (extensionIds.length === 0) return 0;

  const baseUrl = webAppUrl.replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/api/episodes/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ extension_ids: extensionIds }),
  });

  if (!res.ok) return 0;
  const data = await res.json();
  return data.claimed ?? 0;
}

export async function getWebAppAuthHeader() {
  const { webAppApiSecret, webAppUrl } = await chrome.storage.sync.get([
    "webAppApiSecret",
    "webAppUrl",
  ]);
  if (!webAppUrl) return null;

  const session = await getWebAppSession();
  const token = session?.access_token || webAppApiSecret;
  if (!token) return null;

  return { baseUrl: webAppUrl.replace(/\/$/, ""), token, session };
}

export async function fetchEpisodesFromWebApp() {
  const auth = await getWebAppAuthHeader();
  if (!auth?.session) return null;

  const res = await fetch(`${auth.baseUrl}/api/episodes?limit=100`, {
    headers: { Authorization: `Bearer ${auth.session.access_token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch episodes");
  const data = await res.json();
  return data.episodes ?? [];
}

export async function fetchEpisodeFromWebApp(episodeId) {
  const auth = await getWebAppAuthHeader();
  if (!auth?.session) return null;

  const res = await fetch(`${auth.baseUrl}/api/episodes/${episodeId}`, {
    headers: { Authorization: `Bearer ${auth.session.access_token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch episode");
  const data = await res.json();
  return data.episode ?? null;
}
