const { execSync } = require("child_process")

const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" })
const slugify = branch
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+/g, "")
    .replace(/-+$/g, "")
    .toLocaleLowerCase()

if (require.main === module) {
    console.log(slugify)
}
exports.slugify = slugify
