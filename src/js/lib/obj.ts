
import { isObject } from "./is";

export default function obj(o: Object) {
  return {
    toString(num: number | void) {
      return JSON.stringify(o, null, num);
    },

    nestedKeys(): string[] {
      let keys = Object.keys(o);
      for (let key in o) {
        let val = o[key];
        if (isObject(val)) {
          keys = keys.concat(obj(val).nestedKeys());
        }
      }
      return keys;
    },

    sameKeys(other: Object) {
      let myKeys = this.nestedKeys();
      let theirKeys = obj(other).nestedKeys();
      for (let i = 0; i < myKeys.length; i++) if (myKeys[i] !== theirKeys[i]) return false;
      return true;
    },

    isEmpty() {
      return Object.entries(o).length === 0 && o.constructor === Object;
    }
  };
}

export function deleteKey(obj: Object, key: string) {
  let copy = { ...obj };
  delete copy[key];
  return copy;
}