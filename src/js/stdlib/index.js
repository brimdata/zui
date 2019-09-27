/* @flow */

function string(s: string = "") {
  return {
    replace(pattern: string | RegExp, replacement: string) {
      s = s.replace(pattern, replacement)
      return this
    },

    insert(item: string, index: number) {
      s = s.substring(0, index) + item + s.substring(index, s.length)
      return this
    },

    append(str: string) {
      s += str
      return this
    },

    trim() {
      return this.trimInsides().trimOutsides()
    },

    trimInsides() {
      s = s.replace(/\s{2,}/, " ")
      return this
    },

    trimOutsides() {
      s = s.replace(/^\s+/, "")
      s = s.replace(/\s+$/, "")
      return this
    },

    self() {
      return s
    }
  }
}

export default {
  string
}
