"""
Generate logo icons for different platforms.

All output filenames are copied from vue-cli v3.

Prepare:

    Open `rino/art/Logo.xd` with Adobe XD. Export artboards
    as SVG and PNG format into `rino/art/tmp/`.

Install:

    cd rino
    python3 -m venv .venv
    pip3 install pillow

Build:

    .venv/bin/python3 scripts/build_logo.py
"""

import shutil
from os import path

from PIL import Image

ROOT_PATH = path.abspath(path.dirname(path.dirname(__file__)))


def get_input_path(filename):
    return path.join(ROOT_PATH, "art", "tmp", filename)


def get_output_icons_path(filename):
    return path.join(ROOT_PATH, "public", "img", "icons", filename)


def resize_image(in_path, out_path, size):
    img = Image.open(in_path)
    img = img.resize((size, size), Image.BILINEAR)
    img.save(out_path)


def main():
    # Resize .png images
    for in_filename, out_filename, size in [
        ["Circle.png", "android-chrome-192x192.png", 192],
        ["Circle.png", "android-chrome-512x512.png", 512],
        # https://web.dev/apple-touch-icon/
        ["Square.png", "apple-touch-icon-192x192.png", 192],
        ["Square.png", "apple-touch-icon-180x180.png", 180],
        ["Square.png", "apple-touch-icon-152x152.png", 152],
        ["Circle.png", "msapplication-icon-144x144.png", 144],
        ["favicon.png", "favicon-16x16.png", 16],
        ["favicon.png", "favicon-32x32.png", 32],
    ]:
        in_path = get_input_path(in_filename)
        out_path = get_output_icons_path(out_filename)
        resize_image(in_path, out_path, size)

    # Copy .svg images
    for in_filename, out_filename in [["Circle.svg", "safari-pinned-tab.svg"]]:
        in_path = get_input_path(in_filename)
        out_path = get_output_icons_path(out_filename)
        shutil.copyfile(in_path, out_path)

    # Build .ico file
    in_path = get_input_path("favicon.png")
    out_path = path.join(ROOT_PATH, "public", "favicon.ico")
    img = Image.open(in_path)
    assert img.size >= (256, 256)
    # Pillow will save multiple resolutions with different sizes into .ico file by default,
    # from 16*16 to 256*256.
    # See also https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html#ico
    img.save(out_path)

    # Build src/assets/logo.png
    in_path = get_input_path("Circle.png")
    out_path = path.join(ROOT_PATH, "src", "assets", "logo.png")
    resize_image(in_path, out_path, 256)


if __name__ == "__main__":
    main()
