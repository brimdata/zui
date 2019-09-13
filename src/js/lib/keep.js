/* @flow */

import {has, set, get} from "lodash"

import lib from "./"

export default function keep<T>(path: string, init: T) {
  let data: T = {...init}

  function keyErrorMsg(key) {
    return `Unknown Key '${key}': Update the expected data shape in the defaults object.`
  }

  return {
    set(key: string, val: *) {
      if (has(data, key)) set(data, key, val)
      else throw new Error(keyErrorMsg(key))
      return this
    },

    get(key: string) {
      if (has(data, key)) return get(data, key)
      else throw new Error(keyErrorMsg(key))
    },

    save() {
      let string = lib.obj(data).toString(2)
      return lib.file(path).write(string)
    },

    async load() {
      let file = lib.file(path)
      if (await file.exists()) {
        return file.read().then((string) => {
          try {
            data = JSON.parse(string)
          } catch {
            return
          }
        })
      } else {
        return Promise.resolve()
      }
    }
  }
}
