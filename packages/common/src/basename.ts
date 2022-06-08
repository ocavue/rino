/**
 * @public
 */
export function basename(filePath: string) {
    return filePath.split("\\").pop()?.split("/").pop() ?? ""
}
