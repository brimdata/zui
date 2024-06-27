import * as zed from "@brimdata/zed-js"
import {arrayWrap} from "src/util/array-wrap"

/**
 * A field path represents the location of a field in a Zed record.
 * A field path can be nested, reaching into nested records. That's
 * why it's represented as an array of strings. Each item in the
 * array is the name of a nested field.
 */
export class FieldPath {
  locator: string[]
  constructor(locator: string | string[] | zed.Field) {
    this.locator =
      locator instanceof zed.Field ? locator.path : arrayWrap(locator)
  }

  toString() {
    const result = []
    this.locator.forEach((path, i) => {
      if (needsQuotes(path)) {
        // if first path needs quoting, use 'this' as the bracket parent
        if (i === 0) result.push("this")
        result.push(`["${path}"]`)
      } else {
        // prepend path with '.' unless it is the first
        if (i !== 0) result.push(".")
        result.push(path)
      }
    })
    return result.join("")
  }
}

const needsQuotes = (fieldName: string) => !/^[a-zA-Z_$][\w]*$/.test(fieldName)
