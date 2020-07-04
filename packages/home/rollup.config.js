import commonjs from "@rollup/plugin-commonjs"
import html from "@rollup/plugin-html"
import image from "@rollup/plugin-image"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import livereload from "rollup-plugin-livereload"
import postcss from "rollup-plugin-postcss"
import serve from "rollup-plugin-serve"
import typescript from "rollup-plugin-typescript2"

const isProd = process.env.NODE_ENV === "production"
const extensions = [".js", ".ts", ".tsx"]

export default {
    input: isProd ? "src/Homepage.tsx" : "src/index.tsx",
    output: {
        file: isProd ? "dist/Homepage.js" : "dist/index.js",
        format: "esm",
        sourcemap: true,
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(isProd ? "production" : "development"),
        }),
        resolve({
            extensions,
        }),
        commonjs({
            include: /node_modules/,
        }),
        postcss({
            minimize: true,
        }),
        typescript(),
        image(),
        !isProd &&
            html({
                fileName: "index.html",
                template: () => {
                    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Rino</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="app"></div>
    <script src="/index.js"></script>
</body>
</html>
`
                },
            }),
        !isProd &&
            serve({
                host: "localhost",
                port: 3001,
                open: true,
                contentBase: ["dist"],
            }),
        !isProd &&
            livereload({
                watch: "dist",
            }),
    ],
}
