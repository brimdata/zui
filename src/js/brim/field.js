/* @flow */
function field(name: string, type: string, value: string) {
  return {
    name,
    type,
    value,
    queryableValue() {
      let WHITE_SPACE = /\s+/
      let COMMA = /,/
      let quote = [WHITE_SPACE, COMMA].some((reg) => reg.test(this.value))
      if (this.type === "string") quote = true

      return quote ? `"${this.value}"` : this.value
    },
    includeFilter() {
      return `${this.name}=${this.queryableValue()}`
    },
    excludeFilter() {
      return `${this.name}!=${this.queryableValue()}`
    }
  }
}

export default field
