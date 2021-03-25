/* Copyright (c) 2020-present ocavue@gmail.com */

import Document from "next/document"

import { getNextDocument, getNextDocumentInitialProps } from "@rino.app/next/dist/document"

class MyDocument extends Document {
    render() {
        return getNextDocument({ host: "https://www.rino.app", hasManifest: false })
    }
}

MyDocument.getInitialProps = async (ctx) => {
    return await getNextDocumentInitialProps(ctx)
}

export default MyDocument
