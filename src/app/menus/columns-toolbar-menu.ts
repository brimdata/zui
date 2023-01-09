import {ZedTableApi} from "src/components/zed-table/zed-table-api"
import {createMenu, MenuItem} from "src/core/menu"

export const columnsToolbarMenu = createMenu(
  "columnsToolbarMenu",
  (ctx, table: ZedTableApi) => {
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
