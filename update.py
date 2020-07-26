import os
import re
import sys


def main(filename: str):

    with open(filename) as f:
        lines = list(f.readlines())
        origin = tuple(lines)

    for i in range(len(lines)):
        line = lines[i]

        if line.endswith(";\n") and ':' in line:

            # 'align-items' => 'alignItems'
            chars = [c for c in line]
            for j in range(len(chars)):
                if chars[j] == "-":
                    chars[j] = ""
                    chars[j + 1] = chars[j + 1].upper()
                if line[j] == ":":
                    break
            line = "".join(chars)

            line = line.replace(": ", ': "')
            line = line.replace(";", '",')

            lines[i] = line

        # print(''.join(lines))
    if origin != tuple(lines) :
        with open(filename, "w+") as f:

            print('writing', filename)
            f.writelines(lines)

main(sys.argv[1])
