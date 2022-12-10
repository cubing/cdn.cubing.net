#!/usr/bin/env bash

rm -rf dist
cp -R src/static/ dist/

npx esbuild \
  --format=esm --target=es2020 \
  --bundle --splitting \
   --minify --sourcemap \
  --outdir=dist/js \
  --external:crypto \
  --external:worker_threads \
  src/js/*.ts \
  src/js/cubing/*.ts

for f in \
  dist/js/cubing/*.js \
  dist/js/random-uint-below.js \
  dist/js/scramble-display.js \
  dist/js/three.js
do
  mv "$f" "${f%.js}"
done
