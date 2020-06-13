import { DynamicPage } from "src/utils"

export default DynamicPage("DevSignIn", () => import("src/views/DevSignIn"))
