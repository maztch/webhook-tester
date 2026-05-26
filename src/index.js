const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

const HTML_HEADERS = {
  "content-type": "text/html; charset=utf-8",
};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
};

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_PROJECT_ID_LENGTH = 64;
const VIEWER_SESSION_COOKIE = "viewer_session";
const ADMIN_SESSION_COOKIE = "admin_session";

const APP_CSS = `
  :root {
    color-scheme: dark;
    --bg: #0b1020;
    --panel: #11182b;
    --panel-border: #23304a;
    --muted: #8ea0bf;
    --text: #edf3ff;
    --accent: #4fd1c5;
    --danger: #fb7185;
    --surface: #16213b;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    background: linear-gradient(180deg, #08101f 0%, #0b1020 100%);
    color: var(--text);
  }

  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px 48px;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .title {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
  }

  h2 {
    margin: 0;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: var(--muted);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  button,
  input,
  textarea {
    border: 1px solid var(--panel-border);
    background: var(--surface);
    color: var(--text);
    padding: 10px 14px;
    border-radius: 8px;
    font: inherit;
  }

  textarea {
    min-height: 96px;
    resize: vertical;
  }

  button {
    cursor: pointer;
  }

  button.primary {
    background: var(--accent);
    border-color: transparent;
    color: #041217;
    font-weight: 600;
  }

  button.danger {
    background: rgba(251, 113, 133, 0.12);
    border-color: rgba(251, 113, 133, 0.35);
    color: #ffd9df;
  }

  a {
    color: #97fff6;
  }

  .meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .panel {
    background: rgba(17, 24, 43, 0.92);
    border: 1px solid var(--panel-border);
    border-radius: 8px;
  }

  .stat,
  .home-panel,
  .login-panel {
    padding: 18px;
  }

  .stat strong {
    display: block;
    font-size: 24px;
    margin-top: 6px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
    gap: 16px;
  }

  .list {
    max-height: 70vh;
    overflow: auto;
  }

  .entry {
    border-bottom: 1px solid rgba(35, 48, 74, 0.9);
    padding: 14px 16px;
    cursor: pointer;
  }

  .entry:last-child {
    border-bottom: 0;
  }

  .entry.active {
    background: rgba(79, 209, 197, 0.09);
  }

  .row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .stack {
    display: grid;
    gap: 12px;
  }

  .pill {
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
  }

  .method {
    background: rgba(79, 209, 197, 0.15);
    color: #97fff6;
  }

  .size {
    background: rgba(245, 158, 11, 0.12);
    color: #ffd89a;
  }

  .muted {
    color: var(--muted);
  }

  .detail {
    padding: 16px;
  }

  .detail-grid {
    display: grid;
    gap: 14px;
  }

  .section-title {
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .home-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  }

  .field-grid {
    display: grid;
    gap: 12px;
  }

  .field label {
    display: block;
    margin-bottom: 6px;
    color: var(--muted);
    font-size: 13px;
  }

  .field input,
  .field textarea {
    width: 100%;
  }

  .field input[type="checkbox"] {
    width: auto;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .route-box {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(35, 48, 74, 0.9);
    background: #08101f;
    overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    line-height: 1.45;
    white-space: nowrap;
  }

  .route-box.wrap {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .viewer-header {
    display: grid;
    gap: 16px;
    margin-bottom: 16px;
  }

  .viewer-summary {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .viewer-summary .panel {
    padding: 16px;
  }

  .viewer-summary-value {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 600;
  }

  .viewer-routes {
    padding: 16px;
  }

  .viewer-route-grid {
    display: grid;
    gap: 12px;
  }

  .icon-button {
    width: 40px;
    height: 40px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 1;
  }

  .modal[hidden] {
    display: none;
  }

  .modal {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(3, 8, 18, 0.72);
  }

  .modal-card {
    width: min(100%, 560px);
    padding: 18px;
  }

  .login-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .login-panel {
    width: min(100%, 420px);
  }

  .error {
    color: #ffb4c0;
    font-size: 14px;
  }

  .admin-grid {
    display: grid;
    gap: 16px;
  }

  .project-card {
    padding: 18px;
  }

  .admin-row {
    display: grid;
    grid-template-columns: minmax(160px, 220px) minmax(220px, 1fr) minmax(180px, 240px) minmax(180px, 260px) auto;
    gap: 12px;
    align-items: start;
    padding: 14px 16px;
  }

  .project-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .inline-check {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--muted);
    font-size: 13px;
  }

  .inline-check label {
    margin: 0;
  }

  .badge-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .badge {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    border: 1px solid rgba(35, 48, 74, 0.9);
    background: rgba(255, 255, 255, 0.03);
  }

  .admin-row-title {
    font-weight: 600;
  }

  .admin-row-text {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .admin-row-text.lines {
    white-space: pre-line;
  }

  .admin-row-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
  }

  pre {
    margin: 0;
    padding: 12px;
    overflow: auto;
    background: #08101f;
    border: 1px solid rgba(35, 48, 74, 0.9);
    border-radius: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .empty {
    padding: 28px 16px;
    text-align: center;
    color: var(--muted);
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  @media (max-width: 900px) {
    .layout,
    .home-grid {
      grid-template-columns: 1fr;
    }

    .list {
      max-height: none;
    }

    .admin-row {
      grid-template-columns: 1fr;
    }

    .admin-row-actions {
      justify-content: flex-start;
    }
  }
`;

function json(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...JSON_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function html(content, init = {}) {
  return new Response(content, {
    ...init,
    headers: {
      ...HTML_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function redirect(location, init = {}) {
  return new Response(null, {
    ...init,
    status: init.status || 302,
    headers: {
      location,
      ...(init.headers || {}),
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isValidProjectId(value) {
  return /^[a-z0-9][a-z0-9-_]{2,63}$/i.test(value);
}

function normalizeProjectId(value) {
  return String(value || "").trim().toLowerCase().slice(0, MAX_PROJECT_ID_LENGTH);
}

function normalizeDescription(value) {
  return String(value || "").trim().slice(0, MAX_DESCRIPTION_LENGTH);
}

function generateProjectId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 12);
}

function buildProjectPaths(origin, projectId) {
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

function getProjectStore(env, projectId) {
  const id = env.WEBHOOK_STORE.idFromName(projectId);
  return env.WEBHOOK_STORE.get(id);
}

function getProjectRegistry(env) {
  const id = env.PROJECT_REGISTRY.idFromName("global");
  return env.PROJECT_REGISTRY.get(id);
}

function headersToObject(headers) {
  return Object.fromEntries(headers.entries());
}

function sanitizeCapturedHeaders(headers) {
  const sanitized = headersToObject(headers);

  if ("authorization" in sanitized) {
    sanitized.authorization = "[redacted]";
  }

  if ("cookie" in sanitized) {
    sanitized.cookie = "[redacted]";
  }

  return sanitized;
}

function queryToObject(url) {
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

async function serializePayload(request) {
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

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseCookies(request) {
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

function setViewerSessionCookie(projectId, sessionHash) {
  return `${VIEWER_SESSION_COOKIE}_${projectId}=${sessionHash}; Path=/viewer/${projectId}; HttpOnly; SameSite=Lax; Max-Age=2592000`;
}

function clearViewerSessionCookie(projectId) {
  return `${VIEWER_SESSION_COOKIE}_${projectId}=; Path=/viewer/${projectId}; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function setAdminSessionCookie(sessionHash) {
  return `${ADMIN_SESSION_COOKIE}=${sessionHash}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=2592000`;
}

function clearAdminSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function getAuthorizationBearer(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

async function syncProjectRegistry(env, projectId, patch = {}) {
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

function renderHomePage(origin) {
  const initialProjectId = generateProjectId();
  const initialPaths = buildProjectPaths(origin, initialProjectId);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webhook Tester</title>
    <style>${APP_CSS}</style>
  </head>
  <body>
    <div class="page">
      <div class="toolbar">
        <div class="title">
          <h1>Webhook Tester</h1>
          <p>Create or update a project with its own viewer password, API bearer token, and description.</p>
        </div>
      </div>

      <div class="home-grid">
        <div class="panel home-panel stack">
          <div class="section-title">Project Settings</div>
          <div class="field-grid">
            <div class="field">
              <label for="projectId">Project ID</label>
              <div class="form-row">
                <input id="projectId" value="${escapeHtml(initialProjectId)}" autocomplete="off" spellcheck="false" />
                <button id="generate" type="button" class="primary">Generate</button>
              </div>
            </div>
            <div class="field">
              <label for="viewerToken">Viewer Password</label>
              <input id="viewerToken" type="password" autocomplete="new-password" />
            </div>
            <div class="field">
              <label for="apiToken">API Bearer Token</label>
              <input id="apiToken" type="password" autocomplete="new-password" />
            </div>
            <div class="field">
              <label for="description">Description</label>
              <textarea id="description" placeholder="Optional notes about this project"></textarea>
            </div>
          </div>
          <div class="actions">
            <button id="saveAndOpen" class="primary" type="button">Save And Open Viewer</button>
          </div>
          <div id="status" class="muted"></div>
        </div>

        <div class="panel home-panel stack">
          <div class="section-title">Routes</div>
          <div>
            <div class="section-title">Viewer URL</div>
            <div id="viewerUrl" class="route-box">${escapeHtml(initialPaths.viewerUrl)}</div>
          </div>
          <div>
            <div class="section-title">API Base URL</div>
            <div id="apiUrl" class="route-box">${escapeHtml(initialPaths.apiBaseUrl)}</div>
          </div>
          <pre id="usageBox">POST ${escapeHtml(initialPaths.apiBaseUrl)}/anything
Authorization: Bearer &lt;apiToken-if-set&gt;

GET  ${escapeHtml(initialPaths.viewerUrl)}</pre>
        </div>
      </div>
    </div>

    <script>
      const input = document.getElementById("projectId");
      const viewerTokenInput = document.getElementById("viewerToken");
      const apiTokenInput = document.getElementById("apiToken");
      const descriptionInput = document.getElementById("description");
      const generateButton = document.getElementById("generate");
      const saveAndOpenButton = document.getElementById("saveAndOpen");
      const viewerUrl = document.getElementById("viewerUrl");
      const apiUrl = document.getElementById("apiUrl");
      const usageBox = document.getElementById("usageBox");
      const status = document.getElementById("status");

      const makeProjectId = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);
      const normalize = (value) => value.trim().toLowerCase();
      const isValid = (value) => /^[a-z0-9][a-z0-9-_]{2,63}$/i.test(value);

      const update = () => {
        const projectId = normalize(input.value);
        const viewer = location.origin + "/viewer/" + projectId;
        const api = location.origin + "/api/" + projectId;
        viewerUrl.textContent = viewer;
        apiUrl.textContent = api;
        usageBox.textContent = "POST " + api + "/anything\\nAuthorization: Bearer <apiToken-if-set>\\n\\nGET  " + viewer;
        saveAndOpenButton.disabled = !isValid(projectId);
      };

      generateButton.addEventListener("click", () => {
        input.value = makeProjectId();
        update();
      });

      input.addEventListener("input", update);

      saveAndOpenButton.addEventListener("click", async () => {
        const projectId = normalize(input.value);
        if (!isValid(projectId)) {
          status.textContent = "Project ID must be 3-64 chars using letters, numbers, dashes, or underscores.";
          return;
        }

        saveAndOpenButton.disabled = true;
        status.textContent = "Saving project...";

        try {
          const response = await fetch("/projects/" + projectId, {
            method: "PUT",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              description: descriptionInput.value,
              viewerToken: viewerTokenInput.value,
              apiToken: apiTokenInput.value
            })
          });

          const payload = await response.json();
          if (!response.ok) {
            status.textContent = payload.message || "Could not save project.";
            return;
          }

          location.href = "/viewer/" + projectId;
        } catch {
          status.textContent = "Could not save project.";
        } finally {
          saveAndOpenButton.disabled = false;
        }
      });

      update();
    </script>
  </body>
</html>`;
}

function renderViewerLoginPage(origin, projectId, description, errorMessage = "") {
  const paths = buildProjectPaths(origin, projectId);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Login</title>
    <style>${APP_CSS}</style>
  </head>
  <body>
    <div class="login-shell">
      <div class="panel login-panel stack">
        <div class="title">
          <h1>Viewer Access</h1>
          <p>Project <code>${escapeHtml(projectId)}</code></p>
        </div>
        ${description ? `<pre>${escapeHtml(description)}</pre>` : ""}
        <form class="stack" method="post" action="${escapeHtml(paths.viewerLoginPath)}">
          <div class="field">
            <label for="viewerToken">Viewer Password</label>
            <input id="viewerToken" name="viewerToken" type="password" autocomplete="current-password" />
          </div>
          ${errorMessage ? `<div class="error">${escapeHtml(errorMessage)}</div>` : ""}
          <div class="actions">
            <button class="primary" type="submit">Open Viewer</button>
            <a href="/">Back</a>
          </div>
        </form>
      </div>
    </div>
  </body>
</html>`;
}

function renderViewerPage(origin, projectId, settings) {
  const paths = buildProjectPaths(origin, projectId);
  const description = settings.description || "";
  const hasViewerToken = Boolean(settings.viewerTokenHash);
  const hasApiToken = Boolean(settings.apiTokenHash);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webhook Tester</title>
    <style>${APP_CSS}</style>
  </head>
  <body>
    <div class="page">
      <div class="toolbar">
        <div class="title">
          <h1>Webhook Tester</h1>
          <p>Project <code>${escapeHtml(projectId)}</code> is isolated from every other viewer/API pair.</p>
        </div>
        <div class="actions">
          <button id="editProject" class="icon-button" title="Edit project">✎</button>
          <button id="newProject">New Project</button>
          <button id="refresh" class="primary">Refresh</button>
          <button id="clear" class="danger">Clear</button>
        </div>
      </div>

      <div class="viewer-header">
        <div class="viewer-summary">
          <div class="panel">
            <div class="muted">Stored Requests</div>
            <div class="viewer-summary-value" id="count">0</div>
          </div>
          <div class="panel">
            <div class="muted">Viewer Access</div>
            <div class="viewer-summary-value" id="viewerAccessValue">${escapeHtml(hasViewerToken ? "Password Required" : "Open")}</div>
          </div>
          <div class="panel">
            <div class="muted">API Access</div>
            <div class="viewer-summary-value" id="apiAccessValue">${escapeHtml(hasApiToken ? "Bearer Required" : "Open")}</div>
          </div>
        </div>

        <div class="panel viewer-routes">
          <div class="viewer-route-grid">
            <div>
              <div class="section-title">Viewer URL</div>
              <div class="route-box wrap">${escapeHtml(paths.viewerUrl)}</div>
            </div>
            <div>
              <div class="section-title">API Base URL</div>
              <div class="route-box wrap">${escapeHtml(paths.apiBaseUrl)}</div>
            </div>
          </div>
        </div>
      </div>

      <div id="descriptionPanel" class="panel home-panel"${description ? ' style="margin-bottom:16px"' : ' style="display:none;margin-bottom:16px"'}>
        <div class="section-title">Description</div>
        <pre id="descriptionValue">${escapeHtml(description || "")}</pre>
      </div>

      <div class="layout">
        <div class="panel list" id="entries"></div>
        <div class="panel detail">
          <div id="detail"></div>
        </div>
      </div>
    </div>

    <div id="editModal" class="modal" hidden>
      <div class="panel modal-card stack">
        <div class="title">
          <h2>Edit Project</h2>
          <p>Update description, viewer password, or API bearer token.</p>
        </div>
        <div class="field-grid">
          <div class="field">
            <label for="descriptionInput">Description</label>
            <textarea id="descriptionInput" placeholder="Optional notes about this project">${escapeHtml(description || "")}</textarea>
          </div>
          <div class="field">
            <label for="viewerTokenInput">New Viewer Password</label>
            <input id="viewerTokenInput" type="password" autocomplete="new-password" placeholder="Leave blank to keep current password" />
          </div>
          <div class="inline-check">
            <input id="clearViewerTokenInput" type="checkbox" />
            <label for="clearViewerTokenInput">Remove viewer password</label>
          </div>
          <div class="field">
            <label for="apiTokenInput">New API Bearer Token</label>
            <input id="apiTokenInput" type="password" autocomplete="new-password" placeholder="Leave blank to keep current token" />
          </div>
          <div class="inline-check">
            <input id="clearApiTokenInput" type="checkbox" />
            <label for="clearApiTokenInput">Remove API bearer token</label>
          </div>
        </div>
        <div class="actions">
          <button id="cancelEdit">Cancel</button>
          <button id="saveEdit" class="primary">Save</button>
        </div>
        <div id="editStatus" class="muted"></div>
      </div>
    </div>

    <script>
      const projectId = ${JSON.stringify(projectId)};
      const viewerEventsPath = ${JSON.stringify(paths.viewerEventsPath)};
      const viewerSettingsPath = ${JSON.stringify(paths.viewerSettingsPath)};
      const entriesEl = document.getElementById("entries");
      const detailEl = document.getElementById("detail");
      const countEl = document.getElementById("count");
      const viewerAccessValueEl = document.getElementById("viewerAccessValue");
      const apiAccessValueEl = document.getElementById("apiAccessValue");
      const descriptionPanelEl = document.getElementById("descriptionPanel");
      const descriptionValueEl = document.getElementById("descriptionValue");
      const refreshButton = document.getElementById("refresh");
      const clearButton = document.getElementById("clear");
      const newProjectButton = document.getElementById("newProject");
      const editProjectButton = document.getElementById("editProject");
      const editModalEl = document.getElementById("editModal");
      const descriptionInputEl = document.getElementById("descriptionInput");
      const viewerTokenInputEl = document.getElementById("viewerTokenInput");
      const clearViewerTokenInputEl = document.getElementById("clearViewerTokenInput");
      const apiTokenInputEl = document.getElementById("apiTokenInput");
      const clearApiTokenInputEl = document.getElementById("clearApiTokenInput");
      const cancelEditButton = document.getElementById("cancelEdit");
      const saveEditButton = document.getElementById("saveEdit");
      const editStatusEl = document.getElementById("editStatus");

      let events = [];
      let selectedId = null;
      let projectSettings = ${JSON.stringify({
        description: description,
        viewerTokenHash: settings.viewerTokenHash,
        apiTokenHash: settings.apiTokenHash,
      })};

      const formatDate = (value) => new Date(value).toLocaleString();

      const stringify = (value) => {
        if (value == null || value === "") return "(empty)";
        if (typeof value === "string") return value;
        return JSON.stringify(value, null, 2);
      };

      const escapeHtml = (value) =>
        String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");

      const setSecuritySummary = (settings) => {
        viewerAccessValueEl.textContent = settings.viewerTokenHash ? "Password Required" : "Open";
        apiAccessValueEl.textContent = settings.apiTokenHash ? "Bearer Required" : "Open";
      };

      const setDescription = (description) => {
        descriptionInputEl.value = description || "";
        descriptionValueEl.textContent = description || "";
        descriptionPanelEl.style.display = description ? "" : "none";
      };

      const openEditModal = () => {
        descriptionInputEl.value = projectSettings.description || "";
        viewerTokenInputEl.value = "";
        apiTokenInputEl.value = "";
        clearViewerTokenInputEl.checked = false;
        clearApiTokenInputEl.checked = false;
        editStatusEl.textContent = "";
        editModalEl.hidden = false;
      };

      const closeEditModal = () => {
        editModalEl.hidden = true;
      };

      const renderList = () => {
        countEl.textContent = String(events.length);

        if (!events.length) {
          entriesEl.innerHTML = '<div class="empty">No requests captured yet for this project.</div>';
          return;
        }

        entriesEl.innerHTML = events.map((event) => {
          const isActive = event.id === selectedId ? " active" : "";
          return \`
            <div class="entry\${isActive}" data-id="\${event.id}">
              <div class="row">
                <span class="pill method">\${escapeHtml(event.method)}</span>
                <span class="pill size">\${event.bodySize} B</span>
                <span class="muted">\${formatDate(event.createdAt)}</span>
              </div>
              <div style="margin-top:8px;font-weight:600">\${escapeHtml(event.path)}</div>
              <div class="muted" style="margin-top:6px">\${escapeHtml(event.contentType || "No content-type")}</div>
            </div>
          \`;
        }).join("");

        for (const item of entriesEl.querySelectorAll(".entry")) {
          item.addEventListener("click", () => {
            selectedId = item.dataset.id;
            renderList();
            renderDetail();
          });
        }
      };

      const renderDetail = () => {
        const event = events.find((item) => item.id === selectedId) || events[0];
        if (!event) {
          detailEl.innerHTML = '<div class="empty">Select a request to inspect its payload.</div>';
          return;
        }

        if (!selectedId) {
          selectedId = event.id;
          renderList();
        }

        detailEl.innerHTML = \`
          <h2>\${escapeHtml(event.method)} \${escapeHtml(event.path)}</h2>
          <div class="detail-grid">
            <div>
              <div class="section-title">Request</div>
              <pre>\${escapeHtml(stringify({
                id: event.id,
                projectId,
                method: event.method,
                url: event.url,
                path: event.path,
                receivedAt: event.createdAt,
                contentType: event.contentType,
                bodySize: event.bodySize
              }))}</pre>
            </div>
            <div>
              <div class="section-title">Headers</div>
              <pre>\${escapeHtml(stringify(event.headers))}</pre>
            </div>
            <div>
              <div class="section-title">Query</div>
              <pre>\${escapeHtml(stringify(event.query))}</pre>
            </div>
            <div>
              <div class="section-title">Payload</div>
              <pre>\${escapeHtml(stringify(event.payload))}</pre>
            </div>
          </div>
        \`;
      };

      const loadEvents = async () => {
        const response = await fetch(viewerEventsPath);
        if (response.status === 401) {
          location.reload();
          return;
        }
        const payload = await response.json();
        events = payload.events;
        selectedId = events.some((event) => event.id === selectedId) ? selectedId : events[0]?.id || null;
        renderList();
        renderDetail();
      };

      refreshButton.addEventListener("click", loadEvents);
      clearButton.addEventListener("click", async () => {
        clearButton.disabled = true;
        try {
          const response = await fetch(viewerEventsPath, { method: "DELETE" });
          if (response.status === 401) {
            location.reload();
            return;
          }
          selectedId = null;
          await loadEvents();
        } finally {
          clearButton.disabled = false;
        }
      });
      newProjectButton.addEventListener("click", () => {
        location.href = "/";
      });
      editProjectButton.addEventListener("click", openEditModal);
      cancelEditButton.addEventListener("click", closeEditModal);
      editModalEl.addEventListener("click", (event) => {
        if (event.target === editModalEl) {
          closeEditModal();
        }
      });
      saveEditButton.addEventListener("click", async () => {
        saveEditButton.disabled = true;
        editStatusEl.textContent = "Saving project settings...";

        try {
          const response = await fetch(viewerSettingsPath, {
            method: "PUT",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              description: descriptionInputEl.value,
              viewerToken: viewerTokenInputEl.value,
              clearViewerToken: clearViewerTokenInputEl.checked,
              apiToken: apiTokenInputEl.value,
              clearApiToken: clearApiTokenInputEl.checked
            })
          });

          if (response.status === 401) {
            location.reload();
            return;
          }

          const payload = await response.json();
          if (!response.ok) {
            editStatusEl.textContent = payload.message || "Could not save project settings.";
            return;
          }

          projectSettings = payload.settings;
          setSecuritySummary(projectSettings);
          setDescription(projectSettings.description || "");
          closeEditModal();
        } catch {
          editStatusEl.textContent = "Could not save project settings.";
        } finally {
          saveEditButton.disabled = false;
        }
      });

      setSecuritySummary(projectSettings);
      setDescription(projectSettings.description || "");
      loadEvents();
      setInterval(loadEvents, 5000);
    </script>
  </body>
</html>`;
}

function renderAdminLoginPage(errorMessage = "", adminDisabled = false) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Admin Login</title>
    <style>${APP_CSS}</style>
  </head>
  <body>
    <div class="login-shell">
      <div class="panel login-panel stack">
        <div class="title">
          <h1>Admin Access</h1>
          <p>Manage, edit, and remove any project.</p>
        </div>
        ${
          adminDisabled
            ? `<div class="error">Admin is disabled. Set the \`ADMIN_PASSWORD\` worker secret first.</div>`
            : `
        <form class="stack" method="post" action="/admin/login">
          <div class="field">
            <label for="password">Admin Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" />
          </div>
          ${errorMessage ? `<div class="error">${escapeHtml(errorMessage)}</div>` : ""}
          <div class="actions">
            <button class="primary" type="submit">Open Admin</button>
            <a href="/">Back</a>
          </div>
        </form>`
        }
      </div>
    </div>
  </body>
</html>`;
}

function renderAdminPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Admin</title>
    <style>${APP_CSS}</style>
  </head>
  <body>
    <div class="page">
      <div class="toolbar">
        <div class="title">
          <h1>Admin</h1>
          <p>Inspect projects, open them, or remove them.</p>
        </div>
        <div class="actions">
          <button id="refresh" class="primary">Refresh</button>
          <form method="post" action="/admin/logout"><button type="submit">Logout</button></form>
        </div>
      </div>

      <div id="status" class="muted" style="margin-bottom:16px"></div>
      <div id="projects" class="admin-grid"></div>
    </div>

    <template id="projectTemplate">
      <div class="panel admin-row">
        <div class="admin-row-title project-name"></div>
        <div class="admin-row-text project-description">(empty)</div>
        <div class="badge-row project-badges"></div>
        <div class="admin-row-text lines project-meta"></div>
        <div class="admin-row-actions">
          <button class="icon-button project-open" title="Open viewer">↗</button>
          <button class="icon-button danger project-delete" title="Delete project">×</button>
        </div>
      </div>
    </template>

    <script>
      const refreshButton = document.getElementById("refresh");
      const projectsEl = document.getElementById("projects");
      const statusEl = document.getElementById("status");
      const template = document.getElementById("projectTemplate");

      const escapeHtml = (value) =>
        String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");

      const setStatus = (message) => {
        statusEl.textContent = message;
      };

      const badge = (label) => '<span class="badge">' + escapeHtml(label) + '</span>';

      const loadProjects = async () => {
        setStatus("Loading projects...");
        const response = await fetch("/admin/projects");
        if (response.status === 401) {
          location.reload();
          return;
        }

        const payload = await response.json();
        const projects = payload.projects || [];
        projectsEl.innerHTML = "";

        if (!projects.length) {
          projectsEl.innerHTML = '<div class="panel project-card empty">No projects registered yet.</div>';
          setStatus("No projects found.");
          return;
        }

        for (const project of projects) {
          const node = template.content.firstElementChild.cloneNode(true);
          node.querySelector(".project-name").textContent = project.projectId;
          node.querySelector(".project-meta").textContent =
            "Updated " + new Date(project.updatedAt).toLocaleString() +
            (project.lastActivityAt ? "\\nLast request " + new Date(project.lastActivityAt).toLocaleString() : "");
          node.querySelector(".project-description").textContent = project.description || "(empty)";
          node.querySelector(".project-badges").innerHTML = [
            badge(project.hasViewerToken ? "Viewer password" : "Viewer open"),
            badge(project.hasApiToken ? "API bearer" : "API open"),
            badge(project.eventCount + " request" + (project.eventCount === 1 ? "" : "s"))
          ].join("");

          node.querySelector(".project-open").addEventListener("click", () => {
            location.href = "/viewer/" + project.projectId;
          });

          node.querySelector(".project-delete").addEventListener("click", async () => {
            if (!confirm("Delete project " + project.projectId + "? This removes settings and captured requests.")) {
              return;
            }
            const response = await fetch("/admin/projects/" + project.projectId, { method: "DELETE" });
            const payload = await response.json();
            if (!response.ok) {
              setStatus(payload.message || "Could not delete project.");
              return;
            }
            setStatus("Deleted " + project.projectId + ".");
            await loadProjects();
          });

          projectsEl.appendChild(node);
        }

        setStatus("Loaded " + projects.length + " project" + (projects.length === 1 ? "" : "s") + ".");
      };

      refreshButton.addEventListener("click", loadProjects);
      loadProjects();
    </script>
  </body>
</html>`;
}

function routeParts(pathname) {
  return pathname.split("/").filter(Boolean);
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function readFormBody(request) {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}

async function requireViewerAccess(request, env, store, projectId) {
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

async function requireAdminAccess(request, env) {
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

async function fetchProjectSettings(store) {
  const response = await store.fetch("https://store.internal/settings");
  const payload = await response.json();
  return payload.settings;
}

async function persistProjectSettings(env, projectId, settings) {
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

export class WebhookStore {
  constructor(state) {
    this.state = state;
    this.state.blockConcurrencyWhile(async () => {
      this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          created_at TEXT NOT NULL,
          method TEXT NOT NULL,
          url TEXT NOT NULL,
          path TEXT NOT NULL,
          query_json TEXT NOT NULL,
          headers_json TEXT NOT NULL,
          content_type TEXT,
          payload_kind TEXT NOT NULL,
          payload_json TEXT NOT NULL,
          body_size INTEGER NOT NULL
        )
      `);
      this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS project_settings (
          singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
          description TEXT NOT NULL DEFAULT '',
          viewer_token_hash TEXT,
          api_token_hash TEXT,
          updated_at TEXT NOT NULL
        )
      `);
      this.state.storage.sql.exec(`
        INSERT OR IGNORE INTO project_settings (
          singleton,
          description,
          viewer_token_hash,
          api_token_hash,
          updated_at
        ) VALUES (1, '', NULL, NULL, ?)
      `, new Date().toISOString());
    });
  }

  getSettings() {
    const rows = [...this.state.storage.sql.exec(`
      SELECT
        description,
        viewer_token_hash,
        api_token_hash,
        updated_at
      FROM project_settings
      WHERE singleton = 1
      LIMIT 1
    `)];

    const row = rows[0] || {};
    return {
      description: row.description || "",
      viewerTokenHash: row.viewer_token_hash || null,
      apiTokenHash: row.api_token_hash || null,
      updatedAt: row.updated_at || null,
    };
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/settings" && request.method === "GET") {
      return json({ ok: true, settings: this.getSettings() });
    }

    if (url.pathname === "/settings" && request.method === "PUT") {
      const payload = await request.json();
      const updatedAt = new Date().toISOString();

      this.state.storage.sql.exec(
        `
          UPDATE project_settings
          SET
            description = ?,
            viewer_token_hash = ?,
            api_token_hash = ?,
            updated_at = ?
          WHERE singleton = 1
        `,
        payload.description || "",
        payload.viewerTokenHash || null,
        payload.apiTokenHash || null,
        updatedAt,
      );

      return json({
        ok: true,
        settings: this.getSettings(),
      });
    }

    if (url.pathname === "/events" && request.method === "GET") {
      const rows = [...this.state.storage.sql.exec(`
        SELECT
          id,
          created_at,
          method,
          url,
          path,
          query_json,
          headers_json,
          content_type,
          payload_kind,
          payload_json,
          body_size
        FROM events
        ORDER BY created_at DESC
        LIMIT 200
      `)];

      return json({
        events: rows.map((row) => ({
          id: row.id,
          createdAt: row.created_at,
          method: row.method,
          url: row.url,
          path: row.path,
          query: JSON.parse(row.query_json),
          headers: JSON.parse(row.headers_json),
          contentType: row.content_type,
          bodySize: row.body_size,
          payload: JSON.parse(row.payload_json),
          payloadKind: row.payload_kind,
        })),
      });
    }

    if (url.pathname === "/events" && request.method === "DELETE") {
      this.state.storage.sql.exec("DELETE FROM events");
      return json({ ok: true, message: "Stored webhooks cleared" });
    }

    if (url.pathname === "/events" && request.method === "POST") {
      const event = await request.json();
      const now = new Date().toISOString();
      const id = crypto.randomUUID();

      this.state.storage.sql.exec(
        `
          INSERT INTO events (
            id,
            created_at,
            method,
            url,
            path,
            query_json,
            headers_json,
            content_type,
            payload_kind,
            payload_json,
            body_size
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        id,
        now,
        event.method,
        event.url,
        event.path,
        JSON.stringify(event.query || {}),
        JSON.stringify(event.headers || {}),
        event.contentType || null,
        event.payload.kind,
        JSON.stringify(event.payload),
        event.payload.bodySize || 0,
      );

      return json({
        ok: true,
        id,
        createdAt: now,
      });
    }

    if (url.pathname === "/project" && request.method === "DELETE") {
      const updatedAt = new Date().toISOString();
      this.state.storage.sql.exec("DELETE FROM events");
      this.state.storage.sql.exec(
        `
          UPDATE project_settings
          SET
            description = '',
            viewer_token_hash = NULL,
            api_token_hash = NULL,
            updated_at = ?
          WHERE singleton = 1
        `,
        updatedAt,
      );

      return json({
        ok: true,
        message: "Project reset",
      });
    }

    return json({ ok: false, message: "Unknown storage route" }, { status: 404 });
  }
}

export class ProjectRegistry {
  constructor(state) {
    this.state = state;
    this.state.blockConcurrencyWhile(async () => {
      this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          project_id TEXT PRIMARY KEY,
          description TEXT NOT NULL DEFAULT '',
          has_viewer_token INTEGER NOT NULL DEFAULT 0,
          has_api_token INTEGER NOT NULL DEFAULT 0,
          updated_at TEXT NOT NULL,
          last_activity_at TEXT,
          event_count INTEGER NOT NULL DEFAULT 0
        )
      `);
    });
  }

  getProject(projectId) {
    const rows = [...this.state.storage.sql.exec(
      `
        SELECT
          project_id,
          description,
          has_viewer_token,
          has_api_token,
          updated_at,
          last_activity_at,
          event_count
        FROM projects
        WHERE project_id = ?
        LIMIT 1
      `,
      projectId,
    )];
    return rows[0] || null;
  }

  listProjects() {
    const rows = [...this.state.storage.sql.exec(`
      SELECT
        project_id,
        description,
        has_viewer_token,
        has_api_token,
        updated_at,
        last_activity_at,
        event_count
      FROM projects
      ORDER BY updated_at DESC, project_id ASC
    `)];

    return rows.map((row) => ({
      projectId: row.project_id,
      description: row.description,
      hasViewerToken: Boolean(row.has_viewer_token),
      hasApiToken: Boolean(row.has_api_token),
      updatedAt: row.updated_at,
      lastActivityAt: row.last_activity_at,
      eventCount: row.event_count,
    }));
  }

  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/projects" && request.method === "GET") {
      return json({
        ok: true,
        projects: this.listProjects(),
      });
    }

    if (parts[0] === "projects" && parts.length === 2 && request.method === "PUT") {
      const payload = await request.json();
      const projectId = parts[1];
      const current = this.getProject(projectId);
      const updatedAt = payload.updatedAt || current?.updated_at || new Date().toISOString();
      const next = {
        description: payload.description ?? current?.description ?? "",
        hasViewerToken: payload.hasViewerToken ?? Boolean(current?.has_viewer_token),
        hasApiToken: payload.hasApiToken ?? Boolean(current?.has_api_token),
        updatedAt,
        lastActivityAt: payload.lastActivityAt ?? current?.last_activity_at ?? null,
        eventCount: payload.clearEvents
          ? 0
          : Math.max(0, Number(current?.event_count || 0) + Number(payload.eventCountDelta || 0)),
      };

      this.state.storage.sql.exec(
        `
          INSERT INTO projects (
            project_id,
            description,
            has_viewer_token,
            has_api_token,
            updated_at,
            last_activity_at,
            event_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(project_id) DO UPDATE SET
            description = excluded.description,
            has_viewer_token = excluded.has_viewer_token,
            has_api_token = excluded.has_api_token,
            updated_at = excluded.updated_at,
            last_activity_at = excluded.last_activity_at,
            event_count = excluded.event_count
        `,
        projectId,
        next.description,
        next.hasViewerToken ? 1 : 0,
        next.hasApiToken ? 1 : 0,
        next.updatedAt,
        next.lastActivityAt,
        next.eventCount,
      );

      return json({
        ok: true,
        project: {
          projectId,
          ...next,
        },
      });
    }

    if (parts[0] === "projects" && parts.length === 2 && request.method === "DELETE") {
      this.state.storage.sql.exec("DELETE FROM projects WHERE project_id = ?", parts[1]);
      return json({
        ok: true,
        projectId: parts[1],
      });
    }

    return json({ ok: false, message: "Unknown registry route" }, { status: 404 });
  }
}
