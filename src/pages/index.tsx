import { DynamicPage } from "src/utils"

export default DynamicPage("Main", () => import("src/views/Main"))
