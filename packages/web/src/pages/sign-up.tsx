import { DynamicPage } from "src/utils"

export default DynamicPage("SignUp", () => import("src/views/SignUp"))
