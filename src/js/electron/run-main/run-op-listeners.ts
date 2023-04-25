import {ZuiMain} from "../zui-main"
import path from "path"
import {requireDir} from "../utils/require-dir"
import {Operation} from "../../../core/operations"

// Import all operations in the new folder
import * as domainOperations from "src/domain/operations"

const setup = (main) => (exports) => {
  for (const key of Object.keys(exports)) {
    const op = exports[key]
    if (op instanceof Operation) op.listen(main)
  }
}

const opsDir = path.join(__dirname, "../ops")

export function runOpListeners(main: ZuiMain) {
  setup(main)(domainOperations)

  return requireDir({
    dir: opsDir,
    exclude: /\.test/,
    run: setup(main),
  })
}
