import { GetServerSidePropsContext } from "next"
import React from "react"

import { DynamicPage } from "src/utils"
import Landing from "src/views/Landing"

type ServerSideProps = {
    signedIn: boolean
}

export default function IndexPage(props?: ServerSideProps) {
    if (props?.signedIn) {
        return DynamicPage("Index", () => import("src/views/Workspace"))
    } else {
        return <Landing />
    }
}

// This gets called on every request
export function getServerSideProps(context: GetServerSidePropsContext): { props: ServerSideProps } {
    const cookie = context?.req?.headers?.cookie || ""

    const props = { signedIn: false }
    for (const pair of cookie.split(";")) {
        const parts = cookie.split(pair)
        const key = (parts[0] || "").trim()
        const val = (parts[1] || "").trim()
        if (key === "_RINO_SIGN_IN_FLAG_" && val === "1") {
            props.signedIn = true
            return { props }
        }
    }

    return { props }
}
