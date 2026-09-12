# Agent workflow

When changing the storefront, use these role-based passes:

1. **UI/UX pass** — apply the design-system-first approach from `nextlevelbuilder/ui-ux-pro-max-skill`.
2. **Frontend pass** — follow the frontend-design guidance from the curated VoltAgent skill catalog.
3. **Debugging pass** — use systematic debugging: reproduce, isolate, patch, verify.
4. **Testing pass** — validate JavaScript syntax and core store behavior; use browser/E2E testing when the environment supports it.
5. **Verification pass** — do not call a UI change complete until the changed DOM selectors, responsive breakpoints and CI checks are consistent.

Relevant references:
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://github.com/VoltAgent/awesome-agent-skills
