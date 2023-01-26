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
        visible: column.isVisible,
      },
      {
        label: "Show Column",
        iconName: "hide",
        click: () => column.show(),
        visible: !column.isVisible,
      },
    ]
  }
)
