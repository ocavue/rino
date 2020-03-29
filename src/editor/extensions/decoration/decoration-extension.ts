import { NodeExtension, NodeExtensionSpec } from "@remirror/core"

import { createDecorationPlugin } from "./decoration-plugin"

export class RinoDecorationExtension extends NodeExtension {
    get name() {
        return "decoration" as const
    }

    get schema(): NodeExtensionSpec {
        return {}
    }

    // public keys() {
    //     return {
    //         // "Mod-b": toggleMark(type),
    //     }
    // }

    public plugin() {
        return createDecorationPlugin()
    }
}
