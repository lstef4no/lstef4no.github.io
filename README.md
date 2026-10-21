# Stefano Lacovara — personal portfolio

A two-page, static portfolio built with Tailwind CSS. Includes responsive layouts,
light and dark themes, and a saved theme preference. The default follows the
device appearance. The top-right button switches between light and dark in one
click and remembers the choice across both pages. Switching back to the device's
current theme resumes automatic appearance. All content remains available without
JavaScript; JavaScript is only used for the theme switch.

## Local preview

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. Tailwind watches the source files; refresh the browser
after making changes. Stop the preview with Ctrl+C.

## Editing

- `index.html`: introduction, interests, and education.
- `projects.html`: all projects, with stable section anchors for sharing links.
- `css/input.css`: Tailwind theme tokens and shared styles.
- `js/theme.js`: system theme detection and the saved light/dark preference.
- `assets/`: portrait, icons, CV, and thesis.

The navigation and footer are repeated in the two HTML files. Update both when
changing shared links. Add future projects as additional articles in
`projects.html`; individual project pages can be introduced later.

## GitHub Pages

```sh
npm run build
```

Commit the generated `css/style.css` along with the HTML and other changed files.
The repository is ready for GitHub Pages to serve directly from its root; the
deployed site does not need Node.js, a CDN, or a server-side build. Keep the current
GitHub Pages publishing configuration.
