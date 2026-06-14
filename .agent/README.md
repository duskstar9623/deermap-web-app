# .agent/ — Project AI Capabilities

This directory is the single source of truth for all AI-agent instructions and skills used in the deermap-web-app project.

## Files

- `instructions.md` — Core project-level AI instructions (behavioral rules, stack, required skills, references).
- `skills/` — Capability packs loaded on demand by agents.
  - `business-analyst/` — Requirements gatekeeper for new features / modules / changes.
  - `frontend-design/` — Design direction for UI / component / styling tasks.
  - `react-best-practices/` — Performance and correctness guidelines for React/TSX code.
  - `skill-creator/` — Helpers for creating or updating skills.
- `agents/` — Reserved for future agent definitions and specialized agent configurations.
- `prompts/` — Reserved for reusable prompt templates and scenario-specific prompt fragments.

## Agent Entry Points

Different AI agents read different top-level files, which all point back to `.agent/instructions.md`:

- **OpenAI Codex CLI**: reads `AGENTS.md`
- **VS Code + GitHub Copilot**: reads `.github/copilot-instructions.md`
- **Claude Code** (compatibility layer): reads `CLAUDE.md`

When adding or updating AI rules, prefer editing `.agent/instructions.md` or the relevant skill under `.agent/skills/`. Only change the top-level adapter files when you need agent-specific routing logic.
