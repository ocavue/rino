export function setCookie(name: string, value: string, option?: { days?: number; domain?: string }): void {
    let expires = ""
    if (option?.days) {
        const date = new Date()
        date.setTime(date.getTime() + option.days * 24 * 60 * 60 * 1000)
        expires = "; expires=" + date.toUTCString()
    }

    let domain = ""
    if (option?.domain) {
        domain = "; domain=" + option?.domain
    }

    const cookie = `${name}=${value}${expires}${domain}; path=/`
    document.cookie = cookie
}

export function getCookie(name: string): string | null {
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == " ") c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}
