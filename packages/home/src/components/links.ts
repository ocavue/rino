export const DOWNLOAD_LINK = "https://github.com/ocavue/rino/releases"
export const GITHUB_LINK = "https://github.com/ocavue/rino"
export const MAILTO_LINK = "mailto:support@rino.app"
export const TWITTER_LINK = "https://twitter.com/rino_editor"

/**
 * @param version a string like "0.31.2"
 */
export function getDownloadLinks(version: string) {
    return {
        mac: `https://github.com/ocavue/rino/releases/download/v${version}/Rino-${version}-universal.dmg`,
        win: `https://github.com/ocavue/rino/releases/download/v${version}/Rino.Setup.${version}.exe`,
        linux: `https://github.com/ocavue/rino/releases/download/v${version}/Rino-${version}.AppImage`,
    }
}
