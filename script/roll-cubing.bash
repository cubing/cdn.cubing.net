#!/usr/bin/env bash

if [ ! -z "$(git status --porcelain)" ]
then
  echo "git status must be clean"
  echo ""
  git status
  exit 1
fi

VERSION=$(npm show cubing version)
echo "Rolling \`cubing\` to version: v${VERSION}"

npm install "cubing@v${VERSION}"
git stage package*
git commit -m "\`npm install cubing@v${VERSION}\`"
