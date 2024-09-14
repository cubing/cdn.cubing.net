#!/usr/bin/env bash

if [ ! -z "$(git status --porcelain)" ]
then
  echo "git status must be clean"
  echo ""
  git status
  exit 1
fi

VERSION=$(npm show cubing version) # TODO: can `bun` do this?
echo "Rolling \`cubing\` to version: v${VERSION}"

bun add "cubing@v${VERSION}"
git stage package*
git commit -m "\`bun add cubing@v${VERSION}\`"
