import { DynamicPage } from "src/utils"

export default DynamicPage("SignIn", () => import("src/views/SignIn"))
