#!/usr/bin/env bash

# Usage:
# $ cd rino
# $ ultra exec home build
# $ ultra exec editor --rebuild --silent build

set -e

cd $(dirname $0)/..

package_name=$1
shift;

set -x

ultra -r --filter "+*$package_name" $@