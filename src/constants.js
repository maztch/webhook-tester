export const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

export const HTML_HEADERS = {
  "content-type": "text/html; charset=utf-8",
};

export const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
};

export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_PROJECT_ID_LENGTH = 64;
export const VIEWER_SESSION_COOKIE = "viewer_session";
export const ADMIN_SESSION_COOKIE = "admin_session";

export const APP_CSS = `
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
    background: #08101f;
    border: 1px solid rgba(35, 48, 74, 0.9);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    overflow-x: auto;
  }

  .route-box.wrap {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .login-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 16px;
  }

  .login-panel {
    width: min(420px, 100%);
  }

  .error {
    color: #fecdd3;
    background: rgba(251, 113, 133, 0.12);
    border: 1px solid rgba(251, 113, 133, 0.3);
    border-radius: 8px;
    padding: 10px 12px;
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

  .viewer-summary .panel,
  .viewer-routes {
    padding: 16px;
  }

  .viewer-summary-value {
    font-size: 24px;
    font-weight: 700;
    margin-top: 6px;
  }

  .viewer-route-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .admin-grid {
    display: grid;
    gap: 12px;
  }

  .admin-row {
    display: grid;
    grid-template-columns: minmax(180px, 1.1fr) minmax(220px, 1.6fr) minmax(180px, 1.2fr) minmax(220px, 1.4fr) auto;
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

  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    min-width: 40px;
    height: 40px;
    padding: 0;
    font-size: 16px;
    line-height: 1;
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(8, 16, 31, 0.72);
    display: grid;
    place-items: center;
    padding: 16px;
  }

  .modal-card {
    width: min(560px, 100%);
    padding: 18px;
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
