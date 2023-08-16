import {MainObject} from "./main-object"

let _main: MainObject

export function withMain<T>(fn: (main: MainObject) => T): T {
  return fn(_main)
}

export function bindMain(main: MainObject) {
  _main = main
}
