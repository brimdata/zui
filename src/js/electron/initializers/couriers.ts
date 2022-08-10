import {BrimMain} from "../brim"
import path from "path"
import {requireDir} from "../utils/require-dir"

export function initialize(main: BrimMain) {
  return requireDir({
    dir: path.join(__dirname, "../couriers"),
    exclude: /\.test/,
    run: (src) => src.handle(main),
  })
}
