import { APP_CSS } from "./constants.js";
import { buildProjectPaths, escapeHtml, generateProjectId } from "./lib.js";

export function renderHomePage(origin) {
  const initialProjectId = generateProjectId();

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
              <label for="viewerToken">Viewer Password (Optional)</label>
              <input id="viewerToken" type="password" autocomplete="new-password" placeholder="Leave empty to keep viewer open" />
            </div>
            <div class="field">
              <label for="apiToken">API Bearer Token (Optional)</label>
              <input id="apiToken" type="password" autocomplete="new-password" placeholder="Leave empty to keep API open" />
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
          <div class="field">
            <label>Viewer URL</label>
            <div id="viewerRoute" class="route-box wrap"></div>
          </div>
          <div class="field">
            <label>API Base URL</label>
            <div id="apiRoute" class="route-box wrap"></div>
          </div>
          <pre>POST any webhook to:
<span id="apiExample"></span>

Authorization: Bearer &lt;apiToken-if-set&gt;</pre>
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
      const viewerRoute = document.getElementById("viewerRoute");
      const apiRoute = document.getElementById("apiRoute");
      const apiExample = document.getElementById("apiExample");
      const status = document.getElementById("status");

      const normalize = (value) =>
        String(value || "")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 64);

      const generate = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);

      const update = () => {
        const projectId = normalize(input.value);
        const viewer = location.origin + "/viewer/" + projectId;
        const api = location.origin + "/api/" + projectId;
        viewerRoute.textContent = viewer;
        apiRoute.textContent = api;
        apiExample.textContent = api + "/any/path?foo=bar";
      };

      generateButton.addEventListener("click", () => {
        input.value = generate();
        update();
      });

      input.addEventListener("input", update);

      saveAndOpenButton.addEventListener("click", async () => {
        const projectId = normalize(input.value);
        if (!/^[a-z0-9][a-z0-9-_]{2,63}$/i.test(projectId)) {
          status.textContent = "Project ID must be 3-64 characters and use letters, numbers, hyphens, or underscores.";
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

export function renderViewerLoginPage(origin, projectId, description, errorMessage = "") {
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

export function renderViewerPage(origin, projectId, settings) {
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
        description,
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
        events = payload.events || [];
        if (selectedId && !events.some((event) => event.id === selectedId)) {
          selectedId = events[0]?.id || null;
        }
        renderList();
        renderDetail();
      };

      refreshButton.addEventListener("click", loadEvents);
      clearButton.addEventListener("click", async () => {
        if (!confirm("Clear stored requests for this project?")) {
          return;
        }

        const response = await fetch(viewerEventsPath, { method: "DELETE" });
        if (response.status === 401) {
          location.reload();
          return;
        }

        await loadEvents();
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
              apiToken: apiTokenInputEl.value,
              clearViewerToken: clearViewerTokenInputEl.checked,
              clearApiToken: clearApiTokenInputEl.checked
            })
          });

          if (response.status === 401) {
            location.reload();
            return;
          }

          const payload = await response.json();
          if (!response.ok) {
            editStatusEl.textContent = payload.message || "Could not update project settings.";
            return;
          }

          projectSettings = payload.settings;
          setDescription(projectSettings.description);
          setSecuritySummary(projectSettings);
          editStatusEl.textContent = "Project updated.";
          viewerTokenInputEl.value = "";
          apiTokenInputEl.value = "";
          clearViewerTokenInputEl.checked = false;
          clearApiTokenInputEl.checked = false;
          setTimeout(closeEditModal, 400);
        } catch {
          editStatusEl.textContent = "Could not update project settings.";
        } finally {
          saveEditButton.disabled = false;
        }
      });

      setDescription(projectSettings.description);
      setSecuritySummary(projectSettings);
      loadEvents();
      setInterval(loadEvents, 5000);
    </script>
  </body>
</html>`;
}

export function renderAdminLoginPage(errorMessage = "", adminDisabled = false) {
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
        ${adminDisabled ? '<div class="error">Admin is disabled. Set <code>ADMIN_PASSWORD</code>.</div>' : ""}
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
        </form>
      </div>
    </div>
  </body>
</html>`;
}

export function renderAdminPage() {
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
