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
