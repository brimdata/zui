import {createMenu, MenuItem} from "src/core/menu"
import {hideAllColumns, showAllColumns} from "src/domain/results/handlers"

export const columnsToolbarMenu = createMenu(() => {
  return [
    {
      label: "Show All",
      iconName: "show",
      click: () => showAllColumns(),
    },
    {
      label: "Hide All",
      iconName: "hide",
      click: () => hideAllColumns(),
    },
  ] as MenuItem[]
})
