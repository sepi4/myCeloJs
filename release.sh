#!/bin/bash
set -e

VERSION=$(node -p "require('./package.json').version")
TAG="$VERSION"
APPIMAGE="dist/myCelo-${VERSION}.AppImage"
DEB="dist/mycelo_${VERSION}_amd64.deb"
EXE="dist/myCelo Setup ${VERSION}.exe"

echo "=== myCelo Release $TAG ==="
echo ""
echo "Current branch: $(git branch --show-current)"
echo "Uncommitted changes: $(git status --porcelain | wc -l)"
echo ""

read -p "Start building? (y/n) " -n 1 -r
echo ""
[[ $REPLY =~ ^[Yy]$ ]] || exit 0

npm run dist
npm run dist-win

# Verify artifacts exist
echo ""
echo "Build artifacts:"
for f in "$APPIMAGE" "$DEB" "$EXE"; do
    if [[ -f "$f" ]]; then
        echo "  OK: $f"
    else
        echo "  MISSING: $f"
        exit 1
    fi
done

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

gh release create "$TAG" \
  "$APPIMAGE" \
  "$DEB" \
  "$EXE" \
  --title "$TAG" \
  --notes "$NOTES"

echo ""
echo "Release $TAG published!"
