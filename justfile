# Recipes for @nextleap-al/admin-ui.
# Run `just` (or `just --list`) to see everything.

set windows-shell := ["cmd.exe", "/c"]

# Show available recipes
default:
    @just --list

# ---------------------------------------------------------------------------
# Library
# ---------------------------------------------------------------------------



# ---------------------------------------------------------------------------
# Test app (example-3) — consumes the library via a Vite alias to ../src
# ---------------------------------------------------------------------------

# Install example-3 dependencies
[working-directory: 'example-3']
example-install:
    npm install

# Run the example-3 dev server (Vite, hot-reloads library changes)
[working-directory: 'example-3']
example:
    npm run dev

# Production build of example-3
[working-directory: 'example-3']
example-build:
    npm run build

# ---------------------------------------------------------------------------
# Demo (Firebase Hosting) — https://next-admin-ui.web.app
# ---------------------------------------------------------------------------

# Build example-3 and deploy it to Firebase Hosting
deploy: example-build
    firebase deploy --only hosting --project next-admin-ui

# ---------------------------------------------------------------------------
# Publishing
# ---------------------------------------------------------------------------

# Preview exactly what will be published — uploads nothing
pack:
    npm pack --dry-run

# Bump the version (e.g. `just version 2.0.2`, `just version patch|minor|major`)
version bump:
    npm version {{bump}}

# Release: bump+tag version, push tag, deploy demo, then npm publish (e.g. `just release minor`)
release bump="patch":
    npm version {{bump}}
    git push --follow-tags
    just deploy
    just publish
