#!/bin/bash
set -e

VERSION=$(node -p "require('./package.json').version")
TAG="$VERSION"
APPIMAGE="dist/myCelo-${VERSION}.AppImage"
EXE="dist/myCelo-Setup-${VERSION}.exe"

echo "=== myCelo Release $TAG ==="
echo ""

if [[ $(git branch --show-current) != "master" ]]; then
    echo "STOP: not on master"
    exit 1
fi

if [[ -n $(git status --porcelain) ]]; then
    echo "STOP: uncommitted changes"
    exit 1
fi

# The release must be built from exactly the commit that is on GitHub,
# otherwise the tag points to code that was not built.
git fetch --quiet
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/master)
if [[ $LOCAL_COMMIT != "$REMOTE_COMMIT" ]]; then
    echo "STOP: master is not in sync with origin, push or pull first"
    exit 1
fi

# gh also fails when not logged in, so this check passes and the error
# shows up only at gh release create.
if gh release view "$TAG" &>/dev/null; then
    echo "STOP: release $TAG already exists, bump the version:"
    echo "  npm version patch --no-git-tag-version"
    echo "  npm version minor --no-git-tag-version"
    echo "  npm version major --no-git-tag-version"
    exit 1
fi

echo "Checks OK"
echo ""

read -p "Start building? (y/n) " -n 1 -r
echo ""
[[ $REPLY =~ ^[Yy]$ ]] || exit 0

npm run dist
npm run dist-win

# Verify artifacts exist
echo ""
echo "Build artifacts:"
for f in "$APPIMAGE" "$EXE"; do
    if [[ -f "$f" ]]; then
        echo "  OK: $f"
    else
        echo "  MISSING: $f"
        exit 1
    fi
done

echo ""
echo "CHANGELOG.md entry for $VERSION (copy and paste below):"
# Prints the lines between this version's header and the next one,
# without the list indentation.
awk -v header="- **version ${VERSION}.**" '
    $0 == header { found = 1; next }
    found && /^- \*\*version / { exit }
    found { sub(/^    /, ""); print }
' CHANGELOG.md

echo ""
echo "Enter release notes (end with an empty line):"
NOTES=""
while IFS= read -r line; do
    [[ -z "$line" ]] && break
    NOTES="${NOTES}${line}"$'\n'
done

echo ""
echo "--- Release summary ---"
echo "Tag: $TAG"
echo "Notes:"
echo "$NOTES"
echo "-----------------------"

read -p "Create GitHub release? (y/n) " -n 1 -r
echo ""
[[ $REPLY =~ ^[Yy]$ ]] || exit 0

# Without --target, GitHub tags whatever is on the default branch at publish time.
gh release create "$TAG" \
  --target "$LOCAL_COMMIT" \
  "$APPIMAGE" \
  "$EXE" \
  dist/latest-linux.yml \
  dist/latest.yml \
  --title "$TAG" \
  --notes "$NOTES"

echo ""
echo "Release $TAG published!"
