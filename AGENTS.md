# Project

myCelo is an Electron app that shows COH2 and COH3 player rankings.

## Commands

- `npm run typecheck`, `npm run lint`, `npm test`: run these after a code change.
- `npx vitest run <path>`: run one unit test file.
- `npm run build && npx playwright test <name>`: run one e2e spec. E2e tests call real APIs, so run only the specs the change touches, and run them once.
- `npm run format`: format with oxfmt.

## Where things are

- `src/main/` also runs the stream overlay server.
- `src/preload/` exposes `window.electronAPI`. Its types are in `src/electronAPI.d.ts`.
- All UI text is in `src/translations/translation.ts`. Read it through `useText`.
- E2e selectors and helpers are in `e2e/pom/App.pom.ts`. The specs load the log files in `dataExamples/`.

## Large files

Search these files instead of reading them in full:

- `src/functions/__fixtures__/*.json`
- `src/translations/translation.ts`, `src/translations/countries.json`

# Response style

Follow the plain-language principles of ISO 24495-1:2023:

- Write for the reader and their task.
- Put the main point first.
- Use clear headings and group related information.
- Use familiar words and short, direct sentences.
- Give enough detail for the reader to act. Leave out what they do not need.

# Code comments

- Add a comment only when it explains something the code does not show, such as a non-obvious reason or constraint.
- Do not write comments that restate the code or describe a chosen value.
- When code changes, remove a comment that no longer gives a real reason. Do not rewrite it to describe the new code.

# Commit policy

- Follow Conventional Commits without scopes. Use `type: description`, not `type(scope): description`. Do not use parentheses in commit messages.
- Write commit messages in English.
- Keep each commit to one logical change. Do not include unrelated changes.
- Run relevant checks and report any failures or checks you could not run.
- Commit only when the user asks.
