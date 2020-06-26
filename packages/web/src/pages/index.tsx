import { DynamicPage } from "src/utils"

export default function Index() {
    if (localStorage?.getItem("__rino_dev_auth_state") === "yes") {
        return DynamicPage("DynamicIndex", () => import("src/views/Workspace"))
    } else {
        return DynamicPage("DynamicIndex", () => import("src/views/Landing"))
    }
}
