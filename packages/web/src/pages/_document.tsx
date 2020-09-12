import { getNextDocument, getNextDocumentInitialProps } from "@rino.app/next/dist/document"
import Document from "next/document"

class MyDocument extends Document {
    render() {
        return getNextDocument("https://rino.app", true)
    }
}

MyDocument.getInitialProps = async (ctx) => {
    return await getNextDocumentInitialProps(ctx)
}

export default MyDocument
