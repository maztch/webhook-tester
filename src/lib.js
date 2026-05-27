import {
  ADMIN_SESSION_COOKIE,
  CORS_HEADERS,
  HTML_HEADERS,
  JSON_HEADERS,
  MAX_DESCRIPTION_LENGTH,
  MAX_PROJECT_ID_LENGTH,
  VIEWER_SESSION_COOKIE,
} from "./constants.js";

export function json(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...JSON_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function html(content, init = {}) {
  return new Response(content, {
    ...init,
    headers: {
      ...HTML_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function redirect(location, init = {}) {
  return new Response(null, {
    ...init,
    status: init.status || 302,
    headers: {
      location,
      ...(init.headers || {}),
    },
  });
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function isValidProjectId(value) {
  return /^[a-z0-9][a-z0-9-_]{2,63}$/i.test(value);
}

export function normalizeProjectId(value) {
  return String(value || "").trim().toLowerCase().slice(0, MAX_PROJECT_ID_LENGTH);
}

export function normalizeDescription(value) {
  return String(value || "").trim().slice(0, MAX_DESCRIPTION_LENGTH);
}

export function generateProjectId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 12);
}

export function buildProjectPaths(origin, projectId) {
  return {
    viewerPath: `/viewer/${projectId}`,
    viewerEventsPath: `/viewer/${projectId}/events`,
    viewerLoginPath: `/viewer/${projectId}/login`,
    viewerSettingsPath: `/viewer/${projectId}/settings`,
    projectSettingsPath: `/projects/${projectId}`,
    apiBasePath: `/api/${projectId}`,
    viewerUrl: `${origin}/viewer/${projectId}`,
    apiBaseUrl: `${origin}/api/${projectId}`,
  };
}

export function getProjectStore(env, projectId) {
  const id = env.WEBHOOK_STORE.idFromName(projectId);
  return env.WEBHOOK_STORE.get(id);
}

export function getProjectRegistry(env) {
  const id = env.PROJECT_REGISTRY.idFromName("global");
  return env.PROJECT_REGISTRY.get(id);
}

export function headersToObject(headers) {
  return Object.fromEntries(headers.entries());
}

export function sanitizeCapturedHeaders(headers) {
  const sanitized = headersToObject(headers);

  if ("authorization" in sanitized) {
    sanitized.authorization = "[redacted]";
  }

  if ("cookie" in sanitized) {
    sanitized.cookie = "[redacted]";
  }

  return sanitized;
}

export function queryToObject(url) {
  const grouped = new Map();

  for (const [key, value] of url.searchParams.entries()) {
    if (grouped.has(key)) {
      const existing = grouped.get(key);
      grouped.set(key, Array.isArray(existing) ? [...existing, value] : [existing, value]);
      continue;
    }

    grouped.set(key, value);
  }

  return Object.fromEntries(grouped.entries());
}

function toBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function tryDecode(bytes) {
  if (!bytes.length) {
    return "";
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

function tryParseJson(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function serializePayload(request) {
  const bytes = new Uint8Array(await request.arrayBuffer());
  const text = tryDecode(bytes);
  const contentType = request.headers.get("content-type") || "";
  const parsedJson = text && contentType.includes("json") ? tryParseJson(text) : null;

  if (parsedJson !== null) {
    return {
      kind: "json",
      bodySize: bytes.byteLength,
      value: parsedJson,
    };
  }

  if (text !== null) {
    return {
      kind: "text",
      bodySize: bytes.byteLength,
      value: text,
    };
  }

  return {
    kind: "base64",
    bodySize: bytes.byteLength,
    value: toBase64(bytes),
  };
}

export async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function parseCookies(request) {
  const raw = request.headers.get("cookie");
  if (!raw) {
    return {};
  }

  const pairs = raw.split(";");
  const cookies = {};

  for (const pair of pairs) {
    const index = pair.indexOf("=");
    if (index === -1) {
      continue;
    }

    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    cookies[key] = value;
  }

  return cookies;
}

export function setViewerSessionCookie(projectId, sessionHash) {
  return `${VIEWER_SESSION_COOKIE}_${projectId}=${sessionHash}; Path=/viewer/${projectId}; HttpOnly; SameSite=Lax; Max-Age=2592000`;
}

export function clearViewerSessionCookie(projectId) {
  return `${VIEWER_SESSION_COOKIE}_${projectId}=; Path=/viewer/${projectId}; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function setAdminSessionCookie(sessionHash) {
  return `${ADMIN_SESSION_COOKIE}=${sessionHash}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=2592000`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getAuthorizationBearer(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

export async function syncProjectRegistry(env, projectId, patch = {}) {
  const registry = getProjectRegistry(env);
  const body = {
    projectId,
    ...patch,
  };

  const response = await registry.fetch("https://registry.internal/projects/" + encodeURIComponent(projectId), {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

  return response.json();
}

export function routeParts(pathname) {
  return pathname.split("/").filter(Boolean);
}

export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function readFormBody(request) {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}
