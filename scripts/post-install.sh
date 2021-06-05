#!/usr/bin/env bash

set -e

cd $(dirname $0)/..

#### skip postinstall in renovate environment
if [ -z ${YARN_ENABLE_IMMUTABLE_INSTALLS+x} ]; then
    # YARN_ENABLE_IMMUTABLE_INSTALLS is unset
    echo "running post-install.sh";
else
    echo "YARN_ENABLE_IMMUTABLE_INSTALLS is set to '$DEPLOY_ENV'";
    echo "skipping post-install.sh"
    exit 0
fi

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
for package_name in "home"; do
    lnsf "assets/share" "packages/${package_name}/src/assets/share"
    lnsf "assets/share" "packages/${package_name}/public/share"
    cp assets/favicon.ico packages/${package_name}/public/favicon.ico
done
cp assets/share/img/icons/android-chrome-512x512.png packages/electron/resources/icon.png
