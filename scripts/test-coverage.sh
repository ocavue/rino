#!/usr/bin/env bash

set -e
cd $(dirname $0)/..

pnpm clean

export VITEST_PLAYWRIGHT_ENABLE_COVERAGE=yes

echo "Building..."
pnpm turbo run --filter "@rino.app/common" --filter "@rino.app/editor" --filter "@rino.app/playground" build

for package in "@rino.app/common" "@rino.app/editor" "@rino.app/playground" "@rino.app/home"; do
  echo "Testing $package..."
  pnpm run --filter $package test:vitest:coverage
done

echo "Collecting coverage..."
export PATH=$PATH:$PWD/packages/rig/node_modules/.bin

merge-istanbul --out ./coverage/e2e/coverage-e2e.json './packages/*/coverage-e2e/coverage*.json'
merge-istanbul --out ./coverage/uni/coverage-uni.json './packages/*/coverage/coverage-final.json'
merge-istanbul --out ./coverage/all/coverage-all.json ./coverage/e2e/coverage-e2e.json ./coverage/uni/coverage-uni.json

cp ./coverage/all/coverage-all.json ./coverage/coverage-final.json

nyc report -t ./coverage/e2e --report-dir ./coverage/e2e --reporter=html --reporter=text-summary
nyc report -t ./coverage/uni --report-dir ./coverage/uni --reporter=html --reporter=text-summary
nyc report -t ./coverage/all --report-dir ./coverage/all --reporter=html --reporter=text-summary


echo "Coverage report:"
echo "$PWD/coverage/coverage-final.json"
echo "$PWD/coverage/all/index.html"
