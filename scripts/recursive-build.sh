#!/usr/bin/env bash

# Usage:
# $ cd rino
# $ ultra build editor
# $ ultra build home

set -e

package_name=$1
shift;

ultra -r --filter "*$package_name" build $@