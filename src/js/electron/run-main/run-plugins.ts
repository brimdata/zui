import {createPluginContext} from "src/core/plugin"
import {requireDir} from "../utils/require-dir"
import {ZuiMain} from "../zui-main"
import {configurations} from "src/zui"

function bindPluginApi(main: ZuiMain) {
  configurations.store = main.store
}

export async function runPlugins(main: ZuiMain) {
  bindPluginApi(main)
  return requireDir({
    dir: main.args.pluginsPath,
    run: (exported, directory) => {
      exported.activate(createPluginContext(directory))
    },
  })
}
