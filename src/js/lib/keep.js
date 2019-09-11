/* @flow */

import {has, set, get} from "lodash"

import lib from "./"

export default function keep(file: string, defaults: Object) {
  let data = {...defaults}

  return {
    set(key: string, val: *) {
      if (has(data, key)) {
        set(data, key, val)
      } else {
        throw new Error(
          `Unknown Key '${key}': Update the expected data shape in the defaults object.`
        )
      }
      return this
    },

    get(key: string) {
      return get(data, key)
    },

    save() {
      let string = lib.obj(data).toString(2)
      return lib.file(file).write(string)
    },

    load() {
      return lib
        .file(file)
        .read()
        .then((string) => {
          let loaded = JSON.parse(string)
          data = {
            ...data,
            ...loaded
          }
        })
    }
  }
}
