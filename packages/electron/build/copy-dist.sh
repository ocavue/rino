#!/usr/bin/env bash

set -e

# Go to the root of the project
cd $(dirname $0)/../../..

function lnsf {
    source_dir="$(pwd)/$1"
    target_dir="$(pwd)/$2"

    # clean the target
    mkdir -p $target_dir
    rm -rf $target_dir

    mkdir -p $source_dir
    ln -sf $source_dir $target_dir

    echo -e "${source_dir} <- ${target_dir}"
}

lnsf packages/electron-renderer/dist/ packages/electron/assets/renderer
