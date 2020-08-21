#!/usr/bin/env bash

set -e

cd $(dirname $0)/..

source="public/share"
targets="packages/web/public/share packages/home/public/share"

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