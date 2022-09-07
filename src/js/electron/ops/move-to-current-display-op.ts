import {createOperation} from "../operations"
import {screen} from "electron"
import {ZuiWindow} from "../windows/zui-window"
import {stack} from "../windows/dimens"

export const moveToCurrentDisplayOp = createOperation(
  "moveToCurrentDisplay",
  ({main}) => {
    const point = screen.getCursorScreenPoint()
    const bounds = screen.getDisplayNearestPoint(point).workArea
    const {x, y} = bounds

    let prev = [x, y]
    main.windows.all.forEach(({ref: win}: ZuiWindow) => {
      const [width, height] = win.getSize()
      const [x, y] = prev
      const next = stack({x, y, width, height}, bounds, 25)
      win.setBounds(next)
      prev = [next.x, next.y]
    })
  }
)
