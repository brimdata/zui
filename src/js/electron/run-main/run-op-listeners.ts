import {BrimMain} from "../brim"
import path from "path"
import {requireDir} from "../utils/require-dir"
import {Operation, SpecialOperation} from "../operations"

export function runOpListeners(main: BrimMain) {
  return requireDir({
    dir: path.join(__dirname, "../ops"),
    exclude: /\.test/,
    run: (exports) => {
      for (const key of Object.keys(exports)) {
        const op = exports[key]
        if (op instanceof Operation) op.listen(main)
        if (op instanceof SpecialOperation) op.listen()
      }
    },
  })
}
