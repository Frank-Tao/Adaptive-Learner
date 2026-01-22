# Codex Working Agreement

Use this as the default memory for Codex in this repo.

## Tone and Communication
- Keep responses concise and practical; avoid long preambles.
- Ask only when blocked or when a decision materially changes the solution.
- Prefer numbered options for decisions; avoid jargon.

## Branching and Commits
- Start each new feature or fix on a new branch.
- Use short, imperative branch names: `feature/s3-deploy`, `fix/login-typo`.
- Never amend commits unless explicitly asked.

## Naming Conventions
- JS/TS: `camelCase` for variables/functions, `PascalCase` for components/classes.
- Files: `kebab-case` for plain modules, `PascalCase` for React components.
- CSS: class names in `kebab-case`; avoid overly generic names.

## Design Principles (UI)
- Prefer clarity over cleverness; minimize visual noise.
- Establish a clear type scale and spacing rhythm.
- Use consistent colors, spacing, and component states.
- Avoid magic numbers when a theme token exists.

## Code Practices
- Keep functions small and single-purpose.
- Add brief comments only for non-obvious logic.
- Avoid introducing new dependencies without a reason.
- Update or add tests when behavior changes.

## Backend Standards
- Validate inputs at the boundary; never trust client data.
- Use consistent error shapes and HTTP status codes.
- Keep business logic out of controllers/handlers.
- Log actionable context; avoid logging secrets or PII.
- Prefer configuration via env vars; keep defaults sensible.

## Unit Testing Principles
- Test behavior, not implementation details.
- One behavior per test; name tests for intent.
- Keep tests deterministic; avoid network/time dependencies.
- Add tests for bug fixes and new edge cases.
- Prefer fast unit tests; use integration tests where needed.

## Code Review Principles
- Focus on correctness, security, and regression risks first.
- Check for missing tests and unclear error handling.
- Verify naming, consistency, and unnecessary complexity.
- Ensure performance risks are called out with evidence.
- Leave concise, actionable comments; propose alternatives when blocking.

## GitHub Actions / Deploy
- Workflows live at repo root: `.github/workflows/`.
- The UI is in `web/`; ensure workflows use `working-directory: web` when needed.
