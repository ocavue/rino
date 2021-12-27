import { isEqual, isObject } from "lodash-es"
import reduce from "lodash-es/reduce"

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export const diffObject = (object: Record<string, unknown>, base: Record<string, unknown>) => {
    return reduce(
        object,
        (result, value, key) => {
            if (!isEqual(value, base[key])) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                result[key] = isObject(value) && isObject(base[key]) ? diffObject(value, base[key]) : value
            }
            return result
        },
        {},
    )
}
