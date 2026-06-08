# GitHub Copilot Project Instructions

## 1. Conflict Handling (Highest Priority)

If a user request conflicts with any rule in this file (`copilot-instructions.md`), do NOT silently proceed. Instead:

1. Clearly identify which rule is in conflict and why.
2. Propose specific edits to `copilot-instructions.md` that would accommodate the request.
3. Wait for explicit user confirmation before proceeding.
4. Only after confirmation: apply the file update AND fulfill the original request.

## 2. CLAUDE.md Rules (Always Apply)

Follow all principles defined in `CLAUDE.md` for every code modification:

- **Think before coding** — State assumptions explicitly. If uncertain, ask. Surface tradeoffs.
- **Simplicity first** — Minimum code that solves the problem. No speculative features or abstractions.
- **Surgical changes** — Touch only what is necessary. Match existing style. Don't improve adjacent code.
- **Goal-driven execution** — Define success criteria before implementing. Verify after each step.

## 3. Skills (Always Load Before Coding)

- **business-analyst** — When the user requests implementing a new feature, adding a new module/page, or modifying/adjusting any existing feature or module, ALWAYS read `.github/skills/business-analyst/SKILL.md` first and perform the BA review BEFORE generating any implementation code. This acts as a requirements gatekeeper — implementation may only proceed after the analysis is delivered and acknowledged.
- **frontend-design** — When working on any UI, components, pages, or styling tasks, ALWAYS read `.github/skills/frontend-design/SKILL.md` first before generating any code.
- **react-best-practices** — When writing or modifying any React/TSX code, ALWAYS read `.github/skills/react-best-practices/SKILL.md` first before generating any code.

## 4. Project Stack

- **Framework**: React 19 + TypeScript + Vite 7
- **Routing**: React Router v7 (createBrowserRouter)
- **State**: Zustand 5 (module stores) + React Context (Auth/Theme/I18n)
- **Styling**: Tailwind CSS 3 + tailwindcss-animate
- **Animation**: Framer Motion
- **Charts**: Recharts
- **HTTP**: Axios (unified client with interceptors)
- **I18n**: i18next + react-i18next (zh-CN / en-US)
- **Icons**: Lucide React + vite-plugin-svgr (custom SVGs)
- **Structure**: `src/pages/`, `src/components/`, `src/router/`, `src/services/`, `src/configs/`, `src/constants/`, `src/hooks/`, `src/i18n/`, `src/assets/`, `src/types/`, `src/utils/`, `src/app/`
- **Path alias**: `@/` → `src/`
