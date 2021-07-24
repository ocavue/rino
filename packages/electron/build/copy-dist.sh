#!/usr/bin/env bash

set -e

# Go to the root of the project
cd $(dirname $0)/../../..
ROOT=${PWD}

function build_dist {
    package="$1"
    cd ${ROOT}/packages/${package}
    if [ ! -d "./dist" ]; then
        echo "building ${PWD}"
        pnpm build
    fi
}

function lnsf {
    source_dir="$ROOT/$1"
    target_dir="$ROOT/$2"

    # clean the target
    mkdir -p $(dirname $target_dir)
    rm -rf $target_dir || true

    # make sure $source_dir exists
    ls $source_dir > /dev/null

    ln -sf $source_dir $target_dir

    echo -e "${source_dir} <- ${target_dir}"
}

build_dist electron-renderer
build_dist electron-preload
build_dist electron-main

# Keep the relative paths between packages the same during both development and production
lnsf packages/electron-renderer/dist packages/electron/assets/electron-renderer/dist
lnsf packages/electron-preload/dist packages/electron/assets/electron-preload/dist
lnsf packages/electron-main/dist packages/electron/assets/electron-main/dist
