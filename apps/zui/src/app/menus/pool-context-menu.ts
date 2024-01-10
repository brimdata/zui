import {NodeApi, TreeApi} from "react-arborist"
import {Pool} from "../core/pools/pool"
import {createMenu} from "src/core/menu"
import {setFromPin} from "src/domain/session/handlers"

export const poolContextMenu = createMenu(
  (_, tree: TreeApi<Pool>, node: NodeApi<Pool>) => {
    const ids = tree.selectedIds
    const multi = ids.has(node.id) && ids.size > 1
    return [
      {
        label: "Use as From Pin",
        click: () => setFromPin(node.data.name),
      },
      {type: "separator"},
      {
        label: "Rename...",
        click: () => node.edit(),
      },
      {
        label: "Delete",
        click: () => tree.delete(multi ? Array.from(ids) : [node.id]),
      },
    ]
  }
)
