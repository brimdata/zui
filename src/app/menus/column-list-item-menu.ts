import {ZedColumn} from "src/components/zed-table/column"
import {createMenu} from "src/core/menu"

export const columnListItemMenu = createMenu(
  "columnListItemMenu",
  (ctx, column: ZedColumn) => {
    return [
      {
        label: "Hide Column",
        iconName: "show",
        click: () => column.hide(),
      },
      {
        label: "Show Column",
        iconName: "hide",
        click: () => column.show(),
      },
      {
        label: "Expand Columns",
        iconName: "expand-horizontal",
        click: () => column.expand(),
      },
      {
        label: "Expand Columns",
        iconName: "collapse-horizontal",
        click: () => column.collapse(),
      },
    ]
  }
)
