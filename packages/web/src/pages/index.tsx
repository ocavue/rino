import { DynamicPage } from "src/utils"

export default DynamicPage("Index", () => {
    if (localStorage?.getItem("__rino_dev_auth_state") === "yes") {
        return import("src/views/Workspace")
    } else {
        return import("src/views/Landing")
    }
})
