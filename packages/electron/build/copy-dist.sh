#!/usr/bin/env bash

set -e

# Go to the root of the project
cd $(dirname $0)/../../..

if [ "$1" == "--prod" ]; then
    MUST_EXIST=true
else
    MUST_EXIST=false
fi

function lnsf {
    source_dir="$(pwd)/$1"
    target_dir="$(pwd)/$2"

    # clean the target
    mkdir -p $(dirname $target_dir)
    rm -rf $target_dir || true

    if [ "$MUST_EXIST" = true ]; then
        # make sure $source_dir exists
        ls $source_dir > /dev/null
    fi

    ln -sf $source_dir $target_dir

    echo -e "${source_dir} <- ${target_dir}"
}

# Keep the relative paths between packages the same during both development and production
lnsf packages/electron-renderer/dist packages/electron/assets/electron-renderer/dist
lnsf packages/electron-preload/dist packages/electron/assets/electron-preload/dist
lnsf packages/electron-main/dist packages/electron/assets/electron-main/dist
