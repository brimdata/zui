import {MainObject} from "src/core/main/main-object"
import {bindMain} from "src/core/main/with-main"
import {configurations} from "src/zui"

export function runMainBindings(main: MainObject) {
  configurations.store = main.store
  bindMain(main)
}
