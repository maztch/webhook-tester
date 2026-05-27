import { CORS_HEADERS, JSON_HEADERS } from "./constants.js";
import {
  clearAdminSessionCookie,
  getAuthorizationBearer,
  getProjectRegistry,
  isValidProjectId,
  json,
  normalizeDescription,
  normalizeProjectId,
  queryToObject,
  readFormBody,
  readJsonBody,
  redirect,
  routeParts,
  sanitizeCapturedHeaders,
  serializePayload,
  syncProjectRegistry,
} from "./lib.js";
import {
  clearViewerSessionCookie,
  fetchProjectSettings,
  getProjectStore,
  persistProjectSettings,
  requireAdminAccess,
  requireViewerAccess,
  setAdminSessionCookie,
  setViewerSessionCookie,
  sha256Hex,
} from "./auth.js";
import {
  renderAdminLoginPage,
  renderAdminPage,
  renderHomePage,
  renderViewerLoginPage,
  renderViewerPage,
} from "./pages.js";
export { ProjectRegistry, WebhookStore } from "./durable-objects.js";
import { buildProjectPaths, html } from "./lib.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const parts = routeParts(pathname);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    if (pathname === "/") {
      return html(renderHomePage(url.origin));
    }

    if (pathname === "/admin" && request.method === "GET") {
      const admin = await requireAdminAccess(request, env);
      if (admin.disabled) {
        return html(renderAdminLoginPage("", true), { status: 503 });
      }
      if (!admin.ok) {
        return html(renderAdminLoginPage());
      }
      return html(renderAdminPage());
    }

    if (pathname === "/admin/login" && request.method === "POST") {
      const admin = await requireAdminAccess(request, env);
      if (admin.disabled) {
        return html(renderAdminLoginPage("", true), { status: 503 });
      }

      const form = await readFormBody(request);
      const password = String(form?.get("password") || "");
      if (password !== env.ADMIN_PASSWORD) {
        return html(renderAdminLoginPage("Invalid admin password."), { status: 401 });
      }

      return redirect("/admin", {
        headers: {
          "set-cookie": setAdminSessionCookie(admin.expected),
        },
      });
    }

    if (pathname === "/admin/logout" && request.method === "POST") {
      return redirect("/admin", {
        headers: {
          "set-cookie": clearAdminSessionCookie(),
        },
      });
    }

    if (pathname === "/admin/projects" && request.method === "GET") {
      const admin = await requireAdminAccess(request, env);
      if (admin.disabled) {
        return json({ ok: false, message: "Admin is disabled. Set ADMIN_PASSWORD." }, { status: 503 });
      }
      if (!admin.ok) {
        return json({ ok: false, message: "Admin authentication required" }, { status: 401 });
      }

      const registry = getProjectRegistry(env);
      const response = await registry.fetch("https://registry.internal/projects");
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          ...JSON_HEADERS,
          ...CORS_HEADERS,
        },
      });
    }

    if (parts[0] === "admin" && parts[1] === "projects" && parts.length === 3 && request.method === "PUT") {
      const admin = await requireAdminAccess(request, env);
      if (admin.disabled) {
        return json({ ok: false, message: "Admin is disabled. Set ADMIN_PASSWORD." }, { status: 503 });
      }
      if (!admin.ok) {
        return json({ ok: false, message: "Admin authentication required" }, { status: 401 });
      }

      const projectId = normalizeProjectId(parts[2]);
      if (!isValidProjectId(projectId)) {
        return json({ ok: false, message: "Invalid project ID" }, { status: 400 });
      }

      const body = await readJsonBody(request);
      if (!body) {
        return json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
      }

      const store = getProjectStore(env, projectId);
      const currentSettings = await fetchProjectSettings(store);
      const viewerToken = String(body.viewerToken || "");
      const apiToken = String(body.apiToken || "");
      const description = normalizeDescription(body.description);

      const data = await persistProjectSettings(env, projectId, {
        description,
        viewerTokenHash: body.clearViewerToken
          ? null
          : viewerToken
            ? await sha256Hex(viewerToken)
            : currentSettings.viewerTokenHash,
        apiTokenHash: body.clearApiToken
          ? null
          : apiToken
            ? await sha256Hex(apiToken)
            : currentSettings.apiTokenHash,
      });

      return json({
        ...data,
        projectId,
      });
    }

    if (parts[0] === "admin" && parts[1] === "projects" && parts.length === 3 && request.method === "DELETE") {
      const admin = await requireAdminAccess(request, env);
      if (admin.disabled) {
        return json({ ok: false, message: "Admin is disabled. Set ADMIN_PASSWORD." }, { status: 503 });
      }
      if (!admin.ok) {
        return json({ ok: false, message: "Admin authentication required" }, { status: 401 });
      }

      const projectId = normalizeProjectId(parts[2]);
      if (!isValidProjectId(projectId)) {
        return json({ ok: false, message: "Invalid project ID" }, { status: 400 });
      }

      const store = getProjectStore(env, projectId);
      await store.fetch("https://store.internal/project", { method: "DELETE" });
      const registry = getProjectRegistry(env);
      await registry.fetch("https://registry.internal/projects/" + encodeURIComponent(projectId), {
        method: "DELETE",
      });

      return json({
        ok: true,
        message: "Project deleted",
        projectId,
      });
    }

    if (parts[0] === "projects" && parts.length === 2 && request.method === "PUT") {
      const projectId = normalizeProjectId(parts[1]);
      if (!isValidProjectId(projectId)) {
        return json({ ok: false, message: "Invalid project ID" }, { status: 400 });
      }

      const body = await readJsonBody(request);
      if (!body) {
        return json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
      }

      const viewerToken = String(body.viewerToken || "");
      const apiToken = String(body.apiToken || "");
      const description = normalizeDescription(body.description);

      const data = await persistProjectSettings(env, projectId, {
        description,
        viewerTokenHash: viewerToken ? await sha256Hex(viewerToken) : null,
        apiTokenHash: apiToken ? await sha256Hex(apiToken) : null,
      });

      return json({
        ...data,
        projectId,
      });
    }

    if (pathname === "/viewer") {
      return html(renderHomePage(url.origin));
    }

    if (parts[0] === "viewer" && parts.length >= 2) {
      const projectId = normalizeProjectId(parts[1]);
      if (!isValidProjectId(projectId)) {
        return json({ ok: false, message: "Invalid project ID" }, { status: 400 });
      }

      const paths = buildProjectPaths(url.origin, projectId);
      const store = getProjectStore(env, projectId);

      if (pathname === paths.viewerLoginPath && request.method === "POST") {
        const settings = await fetchProjectSettings(store);

        if (!settings.viewerTokenHash) {
          return redirect(paths.viewerPath);
        }

        const form = await readFormBody(request);
        const viewerToken = String(form?.get("viewerToken") || "");
        const hash = viewerToken ? await sha256Hex(viewerToken) : "";

        if (hash !== settings.viewerTokenHash) {
          return html(renderViewerLoginPage(url.origin, projectId, settings.description, "Invalid viewer password."));
        }

        return redirect(paths.viewerPath, {
          headers: {
            "set-cookie": setViewerSessionCookie(projectId, hash),
          },
        });
      }

      const access = await requireViewerAccess(request, env, store, projectId);
      const settings = access.settings;

      if (pathname === paths.viewerPath && request.method === "GET") {
        if (!access.ok) {
          return html(renderViewerLoginPage(url.origin, projectId, settings.description));
        }

        return html(renderViewerPage(url.origin, projectId, settings));
      }

      if (pathname === paths.viewerEventsPath && request.method === "GET") {
        if (!access.ok) {
          return json({ ok: false, message: "Viewer authentication required" }, { status: 401 });
        }

        const response = await store.fetch("https://store.internal/events");
        const data = await response.json();
        return json({
          projectId,
          description: settings.description,
          viewerUrl: paths.viewerUrl,
          apiBase: paths.apiBaseUrl,
          events: data.events,
        });
      }

      if (pathname === paths.viewerEventsPath && request.method === "DELETE") {
        if (!access.ok) {
          return json({ ok: false, message: "Viewer authentication required" }, { status: 401 });
        }

        const response = await store.fetch("https://store.internal/events", { method: "DELETE" });
        const data = await response.json();
        await syncProjectRegistry(env, projectId, {
          clearEvents: true,
        });
        return json({
          ...data,
          projectId,
        });
      }

      if (pathname === paths.viewerSettingsPath && request.method === "PUT") {
        if (!access.ok) {
          return json({ ok: false, message: "Viewer authentication required" }, { status: 401 });
        }

        const body = await readJsonBody(request);
        if (!body) {
          return json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
        }

        const viewerToken = String(body.viewerToken || "");
        const apiToken = String(body.apiToken || "");
        const description = normalizeDescription(body.description);
        const data = await persistProjectSettings(env, projectId, {
          description,
          viewerTokenHash: body.clearViewerToken
            ? null
            : viewerToken
              ? await sha256Hex(viewerToken)
              : settings.viewerTokenHash,
          apiTokenHash: body.clearApiToken
            ? null
            : apiToken
              ? await sha256Hex(apiToken)
              : settings.apiTokenHash,
        });

        const headers = {};
        if (!access.viaAdmin && (body.clearViewerToken || viewerToken)) {
          headers["set-cookie"] = data.settings.viewerTokenHash
            ? setViewerSessionCookie(projectId, data.settings.viewerTokenHash)
            : clearViewerSessionCookie(projectId);
        }

        return json(
          {
            ok: true,
            message: "Project settings updated",
            projectId,
            settings: data.settings,
          },
          { headers },
        );
      }
    }

    if (parts[0] === "api" && parts.length >= 2) {
      const projectId = normalizeProjectId(parts[1]);
      if (!isValidProjectId(projectId)) {
        return json({ ok: false, message: "Invalid project ID" }, { status: 400 });
      }

      const store = getProjectStore(env, projectId);
      const settings = await fetchProjectSettings(store);

      if (settings.apiTokenHash) {
        const bearer = getAuthorizationBearer(request);
        const bearerHash = bearer ? await sha256Hex(bearer) : "";

        if (!bearerHash || bearerHash !== settings.apiTokenHash) {
          return json(
            {
              ok: false,
              message: "Invalid or missing bearer token",
            },
            {
              status: 401,
              headers: {
                "www-authenticate": 'Bearer realm="webhook-tester"',
              },
            },
          );
        }
      }

      const payload = await serializePayload(request.clone());
      const event = {
        projectId,
        method: request.method,
        url: request.url,
        path: url.pathname,
        query: queryToObject(url),
        headers: sanitizeCapturedHeaders(request.headers),
        contentType: request.headers.get("content-type"),
        payload,
      };

      const response = await store.fetch("https://store.internal/events", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(event),
      });
      const data = await response.json();
      await syncProjectRegistry(env, projectId, {
        description: settings.description,
        hasViewerToken: Boolean(settings.viewerTokenHash),
        hasApiToken: Boolean(settings.apiTokenHash),
        updatedAt: settings.updatedAt,
        eventCountDelta: 1,
        lastActivityAt: data.createdAt,
      });

      return json({
        ok: true,
        message: "Webhook stored",
        projectId,
        eventId: data.id,
        storedAt: data.createdAt,
      });
    }

    return json(
      {
        ok: false,
        message: "Not found",
      },
      { status: 404 },
    );
  },
};
