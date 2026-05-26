# Webhook Tester

Cloudflare Worker project created with Wrangler conventions and installed through npm.

## Routes

- `GET /` renders a project ID generator and launcher.
- `PUT /projects/:projectId` saves the project description, optional viewer password, and optional API bearer token.
- `GET /admin` shows the admin interface.
- `POST /admin/login` authenticates admin access with the static `ADMIN_PASSWORD` secret.
- `GET /admin/projects` lists every registered project.
- `PUT /admin/projects/:projectId` edits any existing project.
- `DELETE /admin/projects/:projectId` removes a project and its stored requests.
- `GET /viewer/:projectId` renders the viewer for one project.
- `POST /viewer/:projectId/login` authenticates the viewer when a viewer password is configured.
- `GET /viewer/:projectId/events` returns captured requests for that project as JSON.
- `DELETE /viewer/:projectId/events` clears stored requests for that project.
- `ANY /api/:projectId`
- `ANY /api/:projectId/*`

Any request sent to `/api/:projectId` or a nested path under it is stored only inside that project. The matching viewer is `/viewer/:projectId`.

## Project Settings

From `/`, each project can define:

- `projectId`
- `description` (optional)
- `viewerToken` / viewer password (optional)
- `apiToken` / bearer token (optional)

If `viewerToken` is set, the viewer requires login. If `apiToken` is set, API calls must include `Authorization: Bearer <token>`.

## Admin

Admin access is protected by a static Worker secret:

```bash
wrangler secret put ADMIN_PASSWORD
```

For local development, you can also use a `.dev.vars` file:

```bash
ADMIN_PASSWORD=your-admin-password
```

Then open `/admin` and log in with that password.

## Local development

```bash
npm install
npm run dev
```

Then open the local Wrangler URL and start from `/`.
