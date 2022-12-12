#!/usr/bin/env bash

rm -rf dist

DIST_CDN="./dist/cdn.cubing.net"

mkdir -p "${DIST_CDN}"
cp -R ./src/static/ "${DIST_CDN}"

npx esbuild \
  --format=esm --target=es2020 \
  --bundle --splitting \
   --minify --sourcemap \
  --external:crypto \
  --external:worker_threads \
  --outdir=${DIST_CDN}/js/ \
  ./src/js/*.ts \
  ./src/js/cubing/*.ts

for f in \
  ${DIST_CDN}/js/cubing/*.js \
  ${DIST_CDN}/js/random-uint-below.js \
  ${DIST_CDN}/js/scramble-display.js \
  ${DIST_CDN}/js/three.js
do
  mv "$f" "${f%.js}"
done


npx esbuild \
  --bundle \
  --outdir=${DIST_CDN}/css/ \
  --loader:.woff=copy \
  --loader:.woff2=copy \
  ./src/css/@cubing/icons.css \
  ./src/css/@fontsource/ubuntu.css

for f in \
  ${DIST_CDN}/css/@cubing/icons.css \
  ${DIST_CDN}/css/@fontsource/ubuntu.css
do
  mv "$f" "${f%.css}"
done

# TODO: Update the list of available URLs on the front page.
