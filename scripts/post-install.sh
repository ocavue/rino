#!/usr/bin/env bash

set -e

cd $(dirname $0)/..

#### build symbolic links
function lnsf {
    source_dir="$(pwd)/$1"
    target_dir="$(pwd)/$2"

    # clean the target
    mkdir -p $target_dir
    rm -rf $target_dir

    ln -sf $source_dir $target_dir

    DARK_GRAY='\033[0;30m'
    NO_COLOR='\033[0m'
    echo -e "${DARK_GRAY}${source_dir} <- ${target_dir}${NO_COLOR}"
}
for package_name in "web" "home"; do
    lnsf "assets/share" "packages/${package_name}/src/assets/share"
    lnsf "assets/share" "packages/${package_name}/public/share"
    cp assets/favicon.ico packages/${package_name}/public/favicon.ico
done

#### build packages
yarn run build:pkg
