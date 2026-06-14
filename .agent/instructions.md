# Deermap-web-app AI Instructions

This file is the single source of truth for all AI agents working on the DeerMap project.
It consolidates behavioral guidelines, conflict-handling rules, project stack facts, and skill-loading directives.

---

## 1. Behavioral Guidelines

### 1.1 Think Before Coding

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop, name what's confusing, and ask.

### 1.2 Simplicity First

- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 1.3 Surgical Changes

- Touch only what is necessary.
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

### 1.4 Goal-Driven Execution

- Define success criteria before implementing.
- Transform tasks into verifiable goals:
  - "Add validation" → "Write tests for invalid inputs, then make them pass"
  - "Fix the bug" → "Write a test that reproduces it, then make it pass"
  - "Refactor X" → "Ensure tests pass before and after"
- For multi-step tasks, state a brief plan with verification steps.

---

## 2. Conflict Handling (Highest Priority)

If a user request conflicts with any rule in this file, do NOT silently proceed. Instead:

1. Clearly identify which rule is in conflict and why.
2. Propose specific edits to `.agent/instructions.md` that would accommodate the request.
3. Wait for explicit user confirmation before proceeding.
4. Only after confirmation: apply the file update AND fulfill the original request.

---

## 3. Project Stack

- **Framework**: React 19 + TypeScript + Vite 7
- **Routing**: React Router v7 (`createBrowserRouter`)
- **State**: Zustand 5 (module stores) + React Context (Auth / Theme / I18n)
- **Styling**: Tailwind CSS 3 + tailwindcss-animate
- **Animation**: Framer Motion
- **Charts**: Recharts
- **HTTP**: Axios (unified client with interceptors)
- **I18n**: i18next + react-i18next (zh-CN / en-US)
- **Icons**: Lucide React + vite-plugin-svgr (custom SVGs)
- **Structure**: `src/pages/`, `src/components/`, `src/router/`, `src/services/`, `src/configs/`, `src/constants/`, `src/hooks/`, `src/i18n/`, `src/assets/`, `src/types/`, `src/utils/`, `src/app/`
- **Path alias**: `@/` → `src/`

---

## 4. Required Skills (Load Before Coding)

When the user requests implementing a new feature, adding a new module/page, or modifying/adjusting any existing feature or module, ALWAYS read `.agent/skills/business-analyst/SKILL.md` first and perform the BA review BEFORE generating any implementation code. Implementation may only proceed after the analysis is delivered and acknowledged.

When working on any UI, components, pages, or styling tasks, ALWAYS read `.agent/skills/frontend-design/SKILL.md` first before generating any code.

When writing or modifying any React/TSX code, ALWAYS read `.agent/skills/react-best-practices/SKILL.md` first before generating any code.

---

## 5. Reference Documents

- Business context and decisions: `docs/overview/business.md`
- Technical architecture and phased evolution: `docs/overview/architecture.md`

---

## 6. Future Extensions

Reserved directories for upcoming AI capabilities:

- `.agent/agents/` — For specialized agent definitions and configurations.
- `.agent/prompts/` — For reusable prompt templates and scenario-specific prompt fragments.

When these directories contain active content, load them as instructed in the relevant task context.
