# Claude Code Project Settings

## settings.json

### Hooks

**PostToolUse — Edit | Write**

After every file edit or write, two commands run automatically:

1. **Prettier** — formats the file according to project formatting rules
2. **ESLint** — auto-fixes lint issues (only runs on `.ts` and `.tsx` files)

This ensures files are always formatted and lint-clean when you review them in the editor, without having to wait for a commit.
