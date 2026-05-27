import { JSON_HEADERS, ADMIN_SESSION_COOKIE, VIEWER_SESSION_COOKIE } from "./constants.js";
import {
  clearViewerSessionCookie,
  getProjectStore,
  parseCookies,
  setAdminSessionCookie,
  setViewerSessionCookie,
  sha256Hex,
  syncProjectRegistry,
} from "./lib.js";

export async function requireAdminAccess(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return { ok: false, disabled: true };
  }

  const cookies = parseCookies(request);
  const current = cookies[ADMIN_SESSION_COOKIE];
  const expected = await sha256Hex(env.ADMIN_PASSWORD);

  return {
    ok: current === expected,
    disabled: false,
    expected,
  };
}

export async function fetchProjectSettings(store) {
  const response = await store.fetch("https://store.internal/settings");
  const payload = await response.json();
  return payload.settings;
}

export async function requireViewerAccess(request, env, store, projectId) {
  const settings = await fetchProjectSettings(store);
  const admin = await requireAdminAccess(request, env);

  if (admin.ok) {
    return { ok: true, settings, viaAdmin: true };
  }

  if (!settings.viewerTokenHash) {
    return { ok: true, settings, viaAdmin: false };
  }

  const cookies = parseCookies(request);
  const viewerCookie = cookies[`${VIEWER_SESSION_COOKIE}_${projectId}`];

  if (viewerCookie && viewerCookie === settings.viewerTokenHash) {
    return { ok: true, settings, viaAdmin: false };
  }

  return { ok: false, settings, viaAdmin: false };
}

export async function persistProjectSettings(env, projectId, settings) {
  const store = getProjectStore(env, projectId);
  const response = await store.fetch("https://store.internal/settings", {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(settings),
  });
  const data = await response.json();

  await syncProjectRegistry(env, projectId, {
    description: data.settings.description,
    hasViewerToken: Boolean(data.settings.viewerTokenHash),
    hasApiToken: Boolean(data.settings.apiTokenHash),
    updatedAt: data.settings.updatedAt,
  });

  return data;
}

export {
  clearViewerSessionCookie,
  getProjectStore,
  setAdminSessionCookie,
  setViewerSessionCookie,
  sha256Hex,
};
