#!/usr/bin/env python3

import pathlib
import json
import re
import subprocess

pkg_json_path = pathlib.Path(__file__).parent.parent.joinpath("package.json")


def run(command: str):
    stdout = subprocess.run(
        command, shell=True, capture_output=True, check=True, encoding="utf-8"
    ).stdout
    assert isinstance(stdout, str)
    return stdout


def check_git_status():
    if "nothing to commit, working tree clean" not in run("git status"):
        print("Your git working tree is not clean")
        exit(1)
    if "Your branch is up to date with" not in run("git status"):
        print("Please push or pull your code first")
        exit(1)
    if "Your branch is up to date with" not in run("git fetch --prune && git status"):
        print("Please push or pull your code first")
        exit(1)


def check_branch():
    branch = run("git rev-parse --abbrev-ref HEAD").strip()
    if branch != "master":
        input(f"You are on branch `{branch}`. Continue? ")


def input_version():
    pkg_text = pkg_json_path.read_text()
    old_ver = json.loads(pkg_text)["version"]
    print("Current version:", old_ver)
    new_ver = input("New version: ")
    regex = r"\d+\.\d+\.\d+"
    if not re.match(regex, new_ver):
        print("Version does not match " + regex)
        exit(1)
    return new_ver


def modify_package_json(version):
    pkg = json.loads(pkg_json_path.read_text())
    pkg["version"] = version
    pkg_json_path.write_text(json.dumps(pkg, indent=2) + "\n")


def push_git_tag(version):
    tag = "v" + version
    remote = run("git remote").strip()
    run("git add --all")
    run(f"git commit -m 'chore: Release {tag}'")
    run(f"git tag {tag}")
    run(f"git push")
    run(f"git push {remote} {tag}")


def open_broswer(version):
    run(f"open https://github.com/ocavue/rino/commits/v{version}")


def main():
    check_git_status()
    check_branch()
    version = input_version()
    check_git_status()  # Check again. Avoid any change while waiting `input_version`
    input("Continue? ")
    modify_package_json(version)
    push_git_tag(version)
    open_broswer(version)


if __name__ == "__main__":
    main()
