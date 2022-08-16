import {BrimMain} from "../brim"
import path from "path"
import {requireDir} from "../utils/require-dir"
import {MainOperation} from "../main-op"

export function runOpListeners(main: BrimMain) {
  return requireDir({
    dir: path.join(__dirname, "../ops"),
    exclude: /\.test/,
    run: (exports) => {
      for (const key of Object.keys(exports)) {
        const op = exports[key]
        if (op instanceof MainOperation) {
          op.listen(main)
        }
      }
    },
  })
}
