#!/bin/bash
set -e

# Usage: ./beta.sh [base-version]
# Builds a local Linux AppImage for testing. Nothing is published and
# package.json is not changed.

CURRENT=$(node -p "require('./package.json').version")
BASE=${1:-$(node -p "const [a, b] = '$CURRENT'.split('.'); a + '.' + (Number(b) + 1) + '.0'")}

# Next free beta number for this base version, based on earlier builds in dist.
LAST=$(ls dist/myCelo-"$BASE"-beta.*.AppImage 2>/dev/null \
    | sed -E 's/.*-beta\.([0-9]+)\.AppImage/\1/' | sort -n | tail -1)
VERSION="$BASE-beta.$((${LAST:-0} + 1))"
APPIMAGE="dist/myCelo-${VERSION}.AppImage"

echo "=== myCelo beta $VERSION ($(git rev-parse --short HEAD)) ==="

if [[ -n $(git status --porcelain) ]]; then
    echo "Note: uncommitted changes are included in this build"
fi

npm run typecheck
npm test
npm run build
npx electron-builder --linux --publish never -c.extraMetadata.version="$VERSION"
npm run e2e:dist

echo ""
echo "Beta ready: $APPIMAGE"
