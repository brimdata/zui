import {ZuiMain} from "../zui-main"
import path from "path"
import {requireDir} from "../utils/require-dir"
import {Operation} from "../operations"

const setup = (main) => (exports) => {
  for (const key of Object.keys(exports)) {
    const op = exports[key]
    if (op instanceof Operation) op.listen(main)
  }
}

const opsDir = path.join(__dirname, "../ops")

export function runOpListeners(main: ZuiMain) {
  return requireDir({
    dir: opsDir,
    exclude: /\.test/,
    run: setup(main),
  })
}
