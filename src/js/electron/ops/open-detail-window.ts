import {zed} from "packages/zealot/src"
import {mainOp} from "../main-op"

export const openDetailWindow = mainOp(
  "window.openDetail",
  (main, _e, _arg: {value: zed.Value}) => {
    main.windows.openWindow("detail")
  }
)
