import {Column} from "src/components/zed-table/column"
import {createMenu} from "./create-menu"

export const headerContextMenu = createMenu(
  "headerContextMenu",
  (ctx, column: Column) => {
    return [
      {
        label: "Expand Nested Fields",
        click: () => column.expand(),
      },
      {
        label: "Collapse Nested Fields",
        click: () => column.collapse(),
      },
    ]
  }
)
