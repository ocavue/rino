import Document from "next/document"

import { getNextDocument, getNextDocumentInitialProps } from "@rino.app/next/dist/document"

class MyDocument extends Document {
    render() {
        return getNextDocument({ host: "https://rino.app", hasManifest: true })
    }
}

MyDocument.getInitialProps = async (ctx) => {
    return await getNextDocumentInitialProps(ctx)
}

export default MyDocument
