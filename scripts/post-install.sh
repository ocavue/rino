#!/usr/bin/env bash

set -e

cd $(dirname $0)/..

#### build symbolic links
source="assets/share"
targets="packages/web/src/assets/share packages/home/src/assets/share"

for target in $targets
do
    abs_source="$(pwd)/$source"
    abs_target="$(pwd)/$target"

    # clean the target
    mkdir -p $abs_target
    rm -rf $abs_target

    ln -sf $abs_source $abs_target

    echo $abs_source '<-' $abs_target
done

#### build packages
yarn run build:pkg
