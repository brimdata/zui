/* @flow */

import {has, set, get} from "lodash"

import lib from "./"

export type Keep = {
  set: (string, *) => Keep,
  get: (string) => *,
  save: () => Promise<*>,
  load: () => void
}

export default function keep<T>(path: string, init: T): Keep {
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

    load() {
      let file = lib.file(path)
      if (file.existsSync()) {
        try {
          let string = file.readSync()
          let json = JSON.parse(string)
          data = json
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
