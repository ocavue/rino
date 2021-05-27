#!/usr/bin/env bash

# Usage:
# $ cd rino
# $ ultra build editor
# $ ultra build home

set -e

cd $(dirname $0)/..

package_name=$1
shift;

set -x

ultra -r --filter "+*$package_name" build $@