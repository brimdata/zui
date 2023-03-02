import {ZuiMain} from "../zui-main"
import path from "path"
import {requireDir} from "../utils/require-dir"
import {Operation} from "../operations"

export function runOpListeners(main: ZuiMain) {
  return requireDir({
    dir: path.join(__dirname, "../ops"),
    exclude: /\.test/,
    run: (exports) => {
      for (const key of Object.keys(exports)) {
        const op = exports[key]
        if (op instanceof Operation) op.listen(main)
      }
    },
  })
}
