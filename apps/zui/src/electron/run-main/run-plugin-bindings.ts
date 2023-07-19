import {configurations} from "src/zui"
import {ZuiMain} from "../zui-main"

export function runPluginBindings(main: ZuiMain) {
  configurations.store = main.store
}
