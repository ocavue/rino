import { DynamicPage } from "src/utils"

export default DynamicPage("Index", () => import("src/views/Index"))
