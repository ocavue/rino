// generate configration files for https://github.com/GoogleChrome/lighthouse-ci

const fs = require("fs")
const path = require("path")
const slugifyBranch = require("./slugify-branch").slugify

const commonAssertions = {
    // Preview deployments doesn't allow search engines to index them intentionally.
    "is-crawlable": "warn",

    // I don't know how to fix this.
    "uses-responsive-images": "warn",

    // Material-UI has some components that break this rule
    "non-composited-animations": "warn",
}

const webConfig = {
    ci: {
        collect: {
            startServerCommand: "echo 'nothing to do'",
            url: [
                `https://rino-web-${slugifyBranch}.ocavue.vercel.app/sign-in`,
                `https://rino-web-${slugifyBranch}.ocavue.vercel.app/sign-up`,
                `https://rino-web-${slugifyBranch}.ocavue.vercel.app/password-reset`,
            ],
        },
        upload: {
            target: "temporary-public-storage",
        },
        assert: {
            preset: "lighthouse:recommended",
            assertions: {
                ...commonAssertions,

                // Currently there are 9 javascript bundle files who has a large part of unused code. Firebase contributes most part of them.
                // Check this link for the method to get all unused javascript code: https://web.dev/remove-unused-code/
                // Check this link to follow the progress of tree-shakeable Firebase library: https://github.com/firebase/firebase-js-sdk/issues/2241
                "unused-javascript": ["warn"],

                // `@firebase/firestore/dict/index.cjs.js` has `unload` listeners.
                // https://developers.google.com/web/updates/2018/07/page-lifecycle-api#the-unload-event
                "no-unload-listeners": "warn",

                "non-composited-animations": "warn",
            },
        },
    },
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
            assertions: {
                ...commonAssertions,
            },
        },
    },
}

fs.writeFileSync(path.join(__dirname, "..", ".lighthouserc.web.json"), JSON.stringify(webConfig))
fs.writeFileSync(path.join(__dirname, "..", ".lighthouserc.home.json"), JSON.stringify(homeConfig))
