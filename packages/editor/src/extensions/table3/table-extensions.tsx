import { TableExtension as BaseTableExtension } from "@remirror/extension-tables"

export class ReactTableExtension extends BaseTableExtension {
    get name() {
        return "table" as const
    }
}
