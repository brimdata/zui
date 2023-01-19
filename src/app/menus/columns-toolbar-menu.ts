import {createMenu, MenuItem} from "src/core/menu"
import {TableViewApi} from "src/zui-kit/core/table-view/table-view-api"

export const columnsToolbarMenu = createMenu(
  "columnsToolbarMenu",
  (ctx, table: TableViewApi) => {
    return [
      {
        label: "Show All",
        iconName: "show",
        click: () => table.showAllColumns(),
      },
      {
        label: "Hide All",
        iconName: "hide",
        click: () => table.hideAllColumns(),
      },
    ] as MenuItem[]
  }
)
