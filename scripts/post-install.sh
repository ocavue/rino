#!/usr/bin/env bash

set -e

cd $(dirname $0)/..

# clean
pnpm clean

# create symbolic links
function lnsf {
    source_dir="$(pwd)/$1"
    target_dir="$(pwd)/$2"

    # clean the target
    mkdir -p $target_dir
    rm -rf $target_dir

    ln -sf $source_dir $target_dir

    echo -e "${source_dir} <- ${target_dir}"
}
for package_name in "home"; do
    lnsf "assets/share" "packages/${package_name}/src/assets/share"
    lnsf "assets/share" "packages/${package_name}/public/share"
    cp assets/favicon.ico packages/${package_name}/public/favicon.ico
done
cp assets/share/img/icons/android-chrome-512x512.png packages/electron/resources/icon.png
