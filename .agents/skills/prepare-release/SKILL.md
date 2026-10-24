---
name: prepare-release
description: Prepare a myCelo release by writing the CHANGELOG.md entry from commits since the last release and bumping the version. Use when the user asks to prepare a release, update the changelog for a release, or bump the version.
---

# Prepare release

This prepares everything `./release.sh` needs. The user runs `./release.sh` themselves afterwards.

## 1. Find the changes

```bash
git fetch --tags --quiet
git describe --tags --abbrev=0
git log --format='%h %s' <last-tag>..HEAD
```

If there are no commits since the last tag, tell the user and stop.

## 2. Pick the user-visible changes

Judge each commit by what it changes in the app, not by its commit type. Read the diff with `git show <hash>` when the subject is not clear.

- Include: new features, fixes, visible UI or styling changes, notable dependency changes such as an Electron version change.
- Leave out: release tooling (`release.sh`, npm scripts), docs, tests, refactoring, CI and other developer-only changes.
- Merge several commits about the same thing into one line.

## 3. Choose the version bump

- `minor` if any change adds a new feature.
- `patch` if there are only fixes and small changes.
- `major` only when the user asks for it.

## 4. Show the proposal and wait

Show the user the proposed version and CHANGELOG lines. Wait for approval or changes before editing any file.

## 5. Write the changes

Bump the version without git commit or tag, since `release.sh` creates the tag:

```bash
npm version <patch|minor|major> --no-git-tag-version
```

Add the new entry at the top of `CHANGELOG.md`, directly under `# Changelog`. The header must match this format exactly, including the final period, because `release.sh` looks it up by that text:

```
- **version 2.10.0.**
    - Show players in match history rows
    - Fix: settings view width is capped on wide windows
```

Write each line in English, short and from the user's point of view. Start fixes with `Fix:`.

## 6. Commit and push

Show `git diff`, then ask before committing. Commit `CHANGELOG.md`, `package.json` and `package-lock.json` together:

```bash
git commit -m "chore: bump version to <version>"
```

Ask before pushing. After the push, tell the user to run `./release.sh`.
