import {NodeApi, TreeApi} from "react-arborist"
import {updateFrom} from "../commands/pins"
import {Pool} from "../core/pools/pool"
import {createMenu} from "./create-menu"

export const poolContextMenu = createMenu(
  "poolContextMenu",
  (_, tree: TreeApi<Pool>, node: NodeApi<Pool>) => {
    const ids = tree.selectedIds
    const multi = ids.has(node.id) && ids.size > 1
    return [
      {
        label: "Use as From Pin",
        command: updateFrom.bind(node.data.name),
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
