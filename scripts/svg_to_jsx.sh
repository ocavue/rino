#!/usr/bin/env bash

set -ex
cd $(dirname $0)/..

yarn run svgr --typescript --out-dir packages/editor/src/assets/svg/ packages/editor/src/assets/svg/
