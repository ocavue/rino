/** Load environment variables from .env file to tests */

const fs = require("fs")
const path = require("path")
const dotenv = require("dotenv")

const dotenvPath = path.resolve(__dirname, "..", ".env")
if (fs.existsSync(dotenvPath)) {
    const env = dotenv.parse(fs.readFileSync(dotenvPath))
    Object.assign(process.env, env)
}
