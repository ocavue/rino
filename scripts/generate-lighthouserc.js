// generate configration files for https://github.com/GoogleChrome/lighthouse-ci

const fs = require("fs")
const path = require("path")
const slugifyBranch = require("./slugify-branch").slugify

const webConfig = {
    ci: {
        collect: {
            startServerCommand: "echo 'nothing to do'",
            url: [
                `https://rino-web-${slugifyBranch}.ocavue.vercel.app/sign-in`,
                `https://rino-web-${slugifyBranch}.ocavue.vercel.app/sign-up`,
            ],
        },
        upload: {
            target: "temporary-public-storage",
        },
        assert: {
            preset: "lighthouse:recommended",
            assertions: {
                // Currently there are 9 javascript bundle files who has a large part of unused code. Firebase contributes most part of them.
                // Check this link for the method to get all unused javascript code: https://web.dev/remove-unused-code/
                // Check this link to follow the progress of tree-shakeable Firebase library: https://github.com/firebase/firebase-js-sdk/issues/2241
                "unused-javascript": ["warn", { maxLength: 9 }],

                // `@firebase/firestore/dict/index.cjs.js` has `unload` listeners.
                // https://developers.google.com/web/updates/2018/07/page-lifecycle-api#the-unload-event
                "no-unload-listeners": "warn",

                // I don't know how to fix this.
                "uses-responsive-images": "warn",
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
            preset: "lighthouse:recommended",
            assertions: {
                "unused-javascript": ["warn", { maxLength: 9 }],
                "no-unload-listeners": "warn",
                "uses-responsive-images": "warn",

                "installable-manifest": "warn",
                "maskable-icon": "warn",
                "offline-start-url": "warn",
                "service-worker": "warn",
                "splash-screen": "warn",
                "themed-omnibox": "warn",
                "works-offline": "warn",
            },
        },
    },
}

fs.writeFileSync(path.join(__dirname, "..", ".lighthouserc.web.json"), JSON.stringify(webConfig))
fs.writeFileSync(path.join(__dirname, "..", ".lighthouserc.home.json"), JSON.stringify(homeConfig))
