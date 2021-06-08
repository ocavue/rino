#!/usr/bin/env bash

set -ex
cd $(dirname $0)/..

pnpm run svgr --typescript --out-dir packages/editor/src/assets/svg/ packages/editor/src/assets/svg/
