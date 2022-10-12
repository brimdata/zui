import {TreeApi} from "react-arborist"
import {Group, Query} from "src/js/state/Queries/types"
import {createMenu} from "./create-menu"

export const queryTreeContextMenu = createMenu(
  "queryTreeContextMenu",
  (_, tree: TreeApi<Query | Group>) => {
    return [
      {
        label: "New Query...",
        accelerator: "a",
        click: () => {
          tree.createLeaf()
        },
      },
      {
        label: "New Folder...",
        accelerator: "Shift+a",
        click: () => {
          tree.createInternal()
        },
      },
    ]
  }
)
