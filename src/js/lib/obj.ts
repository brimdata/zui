import {isObject} from "./is"

export default function obj(o: Object) {
  return {
    nestedKeys(): string[] {
      let keys = Object.keys(o)
      for (const key in o) {
        const val = o[key]
        if (isObject(val)) {
          keys = keys.concat(obj(val).nestedKeys())
        }
      }
      return keys
    },

    sameKeys(other: Object) {
      const myKeys = this.nestedKeys()
      const theirKeys = obj(other).nestedKeys()
      for (let i = 0; i < myKeys.length; i++)
        if (myKeys[i] !== theirKeys[i]) return false
      return true
    },

    isEmpty() {
      return Object.entries(o).length === 0 && o.constructor === Object
    }
  }
}

export function deleteKey(obj: Object, key: string) {
  const copy = {...obj}
  delete copy[key]
  return copy
}
