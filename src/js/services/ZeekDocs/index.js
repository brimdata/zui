/* @flow */
import alltypes from "./descriptions"

export default {
  describe(path: string, name: string = "") {
    let firstPartOfName = name.split(".")[0]
    let log = alltypes[`${path}_log`] || []
    let field = log.find((f) => f.name === firstPartOfName) || {}

    return field.desc || ""
  }
}
