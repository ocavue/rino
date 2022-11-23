# Workflow for SVGs

## Logos

1. Open [figma](https://www.figma.com/).
2. Export artboards as SVG and PNG formats into `rino/art/tmp/`.
3. run `scripts/build_logo.py`.

```
Install:

    cd rino
    python3 -m venv .venv
    . ./.venv/bin/activate
    pip3 install pillow

Build:

    .venv/bin/python3 scripts/build_logo.py
```

## Table icons

1. Open [figma](https://www.figma.com/).
2. Export artboards as SVG format.
3. Use https://vecta.io/nano to compress SVG files.
4. Put them into `packages/web/src/assets/svg/`.

# Figma Tips:

-   Press Command key to ajust the frame
