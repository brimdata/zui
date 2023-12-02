import {createMenu} from "src/core/menu"
import {hideColumn, showColumn} from "src/domain/results/handlers"
import {TableColumn} from "src/js/state/Table/selectors"

export const columnListItemMenu = createMenu((ctx, column: TableColumn) => {
  return [
    {
      label: "Hide Column",
      iconName: "show",
      click: () => hideColumn(column.id),
      visible: column.isVisible,
    },
    {
      label: "Show Column",
      iconName: "hide",
      click: () => showColumn(column.id),
      visible: !column.isVisible,
    },
  ]
})
