# Pinnacle Report

A small Node + Express site that serves a dynamic personal finance landing page with editable content via JSON.

## Run locally

```bash
cd "/Users/kevin.utterback/Desktop/CBQ Media/Pinnacle Report/pinnacle-report"
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Local content editing

This project stores editable page content in:

- `data/content.json`

You can edit content manually in that file, or use the built-in admin editor:

```text
http://localhost:3000/admin
```

If you set `ADMIN_KEY` in your environment, use this format:

```text
http://localhost:3000/admin?admin_key=your-admin-key-here
```

### Admin protection

- The admin editor is protected if `ADMIN_KEY` is set.
- You can configure the key locally via `.env` or your shell.

## Deployment

This app can be deployed to any Node hosting provider that supports Express.

### Render

A ready-to-use `render.yaml` file is included. To deploy on Render:

1. Push this repo to GitHub.
2. Create a new Web Service on Render.
3. Connect the repo and use:
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`
4. Set the environment variable `ADMIN_KEY`.

### Environment variables

Use `.env.example` as a template:

```text
PORT=3000
ADMIN_KEY=your-admin-key-here
```

## APIs

- `GET /api/pages` — list supported editable pages
- `GET /api/content/:page` — return content for a page
- `PUT /api/content/:page` — update a page's content JSON
- `POST /api/newsletter` — newsletter sign-up endpoint

## Files

- `server.js` — Express server and API routes
- `data/content.json` — persisted page content data
- `admin.html` — local content editor UI
- `js/admin.js` — admin editor client logic
- `js/page-content.js` — loads page content into HTML
- `css/styles.css` — shared site styles
