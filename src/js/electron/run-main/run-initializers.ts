import log from "electron-log"
import path from "path"
import {ZuiMain} from "../zui-main"
import {requireDir} from "../utils/require-dir"

export async function runInitializers(main: ZuiMain) {
  await requireDir({
    dir: path.join(__dirname, "../initializers"),
    exclude: /\.test/,
    run: (src, file) => {
      log.debug("Initializing:", path.basename(file))
      src.initialize && src.initialize(main)
    },
  })
  log.info(`initializers loaded`)
}
