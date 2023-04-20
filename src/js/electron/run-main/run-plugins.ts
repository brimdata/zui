import {requireDir} from "../utils/require-dir"
import {ZuiMain} from "../zui-main"

export async function runPlugins(main: ZuiMain) {
  return requireDir({
    dir: main.args.pluginsPath,
    run: (exported) => {
      exported.activate(main)
    },
  })
}
