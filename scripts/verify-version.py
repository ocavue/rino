#!/usr/bin/env python3

import pathlib
import json
import os

pkg_text = pathlib.Path(__file__).parent.parent.joinpath("package.json").read_text()
pkg_ver = json.loads(pkg_text)["version"]
git_ver = os.environ["CIRCLE_TAG"]
print(f"debug pkg_ver: {repr(pkg_ver)}, git_ver: {repr(git_ver)}")
assert isinstance(pkg_ver, str) and isinstance(git_ver, str)
assert "v" + pkg_ver == git_ver
