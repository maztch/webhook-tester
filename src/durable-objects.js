import { json } from "./lib.js";

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
