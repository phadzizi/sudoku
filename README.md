# Sudoku

A cross-platform Sudoku app built with React, TypeScript, and Capacitor. One codebase — web, Android, and iOS.

## Stack

| Layer          | Choice                                               |
| -------------- | ---------------------------------------------------- |
| UI framework   | React 18 + TypeScript                                |
| Mobile wrapper | Capacitor 6                                          |
| Build tool     | Vite 5                                               |
| State          | Zustand                                              |
| Animations     | Framer Motion                                        |
| Unit tests     | Vitest + React Testing Library                       |
| E2E tests      | Playwright                                           |
| Lint           | ESLint + `@typescript-eslint/no-explicit-any: error` |
| Format         | Prettier                                             |

## Running the app

### Web

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Android

```bash
npm install
npm run cap:android
```

### iOS

```bash
npm install
npm run cap:ios
```

## Quality gates

```bash
npm run check        # format + lint + typecheck + test + build
npm run test:watch   # tests in watch mode during development
npm run test:e2e     # Playwright end-to-end tests
```

## AI delivery framework

| File                                                             | Purpose                          |
| ---------------------------------------------------------------- | -------------------------------- |
| [`AGENTS.md`](AGENTS.md)                                         | Agent workflow and rules         |
| [`ai/GOOD_CODE_STANDARD.md`](ai/GOOD_CODE_STANDARD.md)           | What "good code" means here      |
| [`ai/TASK_BREAKDOWN_PROTOCOL.md`](ai/TASK_BREAKDOWN_PROTOCOL.md) | How to break features into tasks |
| [`ai/FEATURE_STANDARD.md`](ai/FEATURE_STANDARD.md)               | Architecture rules               |
| [`ai/DEFINITION_OF_DONE.md`](ai/DEFINITION_OF_DONE.md)           | Checklist before any PR          |
| [`ai/UI_DESIGN_STANDARD.md`](ai/UI_DESIGN_STANDARD.md)           | Design tokens and patterns       |
| [`ai/MOBILE_WEB_TESTING.md`](ai/MOBILE_WEB_TESTING.md)           | Testing protocol                 |
| [`ai/SELF_REVIEW_PROMPT.md`](ai/SELF_REVIEW_PROMPT.md)           | Agent self-review protocol       |
| [`ai/tasks/`](ai/tasks/)                                         | Per-feature task specs           |

## Contact

info@xquiz.co.za
