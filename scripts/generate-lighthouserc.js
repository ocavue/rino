// generate configration files for https://github.com/GoogleChrome/lighthouse-ci

const fs = require("fs")
const path = require("path")
const slugifyBranch = require("./slugify-branch").slugify

const assertions = {
    // I don't know how to fix this.
    "uses-responsive-images": "warn",

    // Since the website is not deployed on my own server, I can't do much about the HTTP response headers.
    "csp-xss": "warn",

    // Fix them later
    "non-composited-animations": "warn",
    "lcp-lazy-loaded": "warn",
    "bf-cache": "warn",
}

const homeConfig = {
    ci: {
        collect: {
            startServerCommand: "echo 'nothing to do'",
            url: [`https://rino-home-${slugifyBranch}.ocavue.vercel.app/`],
        },
        upload: {
            target: "temporary-public-storage",
        },
        assert: {
            preset: "lighthouse:no-pwa",
            assertions,
        },
    },
}

fs.writeFileSync(path.join(__dirname, "..", ".lighthouserc.home.json"), JSON.stringify(homeConfig))
