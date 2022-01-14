export const RELEASE_LINK = "https://github.com/ocavue/rino/releases"
export const GITHUB_LINK = "https://github.com/ocavue/rino"
export const MAILTO_LINK = "mailto:support@rino.app"
export const TWITTER_LINK = "https://twitter.com/rino_editor"
export const DISCORD_LINK = "https://rino.app/chat"

/**
 * @param version a string like "0.31.2"
 */
export function getDownloadLink(os: "mac" | "win" | "linux", version: string | undefined): string {
    if (!version) return RELEASE_LINK

    // TODO: remove this
    if (version === "0.39.1") {
        return RELEASE_LINK
    }

    switch (os) {
        case "mac":
            return `https://github.com/ocavue/rino/releases/download/v${version}/Rino-v${version}-mac-universal.dmg`
        case "win":
            return `https://github.com/ocavue/rino/releases/download/v${version}/Rino-v${version}-win-x64.exe`
        case "linux":
            return `https://github.com/ocavue/rino/releases/download/v${version}/Rino-v${version}-linux-x86_64.AppImage`
    }
}
