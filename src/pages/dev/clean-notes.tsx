import { DynamicPage } from "src/utils"

export default DynamicPage("DevCleanNotes", () => import("src/views/DevCleanNotes"))
