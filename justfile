# Recipes for @nextleap-al/admin-ui.
# Run `just` (or `just --list`) to see everything.

set windows-shell := ["cmd.exe", "/c"]

# Show available recipes
default:
    @just --list

# ---------------------------------------------------------------------------
# Library
# ---------------------------------------------------------------------------

# Install library dependencies
install:
    npm install

# Rebuild the library on every change (tsup --watch)
dev:
    npm run dev

# Build the library into dist/
build:
    npm run build

# Type-check the library without emitting
typecheck:
    npm run typecheck

# Lint the library source
lint:
    npm run lint

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

# Preview the example-3 production build
[working-directory: 'example-3']
example-preview:
    npm run preview

# Fresh start: install lib + example deps, then launch the example dev server
test-ui: install example-install example

# ---------------------------------------------------------------------------
# Publishing
# ---------------------------------------------------------------------------

# Log in to the npm registry (interactive; needs @nextleap-al org access)
login:
    npm login

# Preview exactly what will be published — uploads nothing
pack:
    npm pack --dry-run

# Bump the version (e.g. `just version 2.0.2`, `just version patch|minor|major`)
version bump:
    npm version {{bump}}

# Build then publish to npm — add an OTP if you have 2FA: `just publish --otp=123456`
publish *args: build
    npm publish {{args}}
