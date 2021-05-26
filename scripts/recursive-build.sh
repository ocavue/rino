#!/usr/bin/env bash

set -e

package_name=$1
shift;

ultra -r --filter "*$package_name" build $@