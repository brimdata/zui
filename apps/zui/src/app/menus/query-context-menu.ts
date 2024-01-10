import {NodeApi, TreeApi} from "react-arborist"
import {Group, Query} from "src/js/state/Queries/types"
import {copyQueryToClipboard} from "../commands/copy-query-to-clipboard"
import {deleteQueries} from "../commands/delete-queries"
import {exportQueryGroup} from "../commands/export-query-group"
import {openQuery} from "../commands/open-query"
import {createMenu} from "src/core/menu"

export const queryContextMenu = createMenu(
  (_, tree: TreeApi<Query | Group>, node: NodeApi<Query | Group>) => {
    const ids = tree.selectedIds
    const multi = ids.has(node.id) && ids.size > 1
    return [
      {
        label: "New Query...",
        visible: node.isInternal,
        accelerator: "a",
        click: () => {
          tree.focus(node)
          tree.createLeaf()
        },
      },
      {
        label: "New Folder...",
        visible: node.isInternal,
        accelerator: "Shift+a",
        click: () => {
          tree.focus(node)
          tree.createInternal()
        },
      },
      {
        label: "Open Query",
        visible: node.isLeaf,
        click: () => openQuery.run(node.id),
      },
      {type: "separator"},
      {
        label: "Export Query Group...",
        click: () => exportQueryGroup.run(node as NodeApi<Group>),
        visible: node.isInternal,
      },
      {
        label: "Copy Query Value",
        visible: node.isLeaf,
        click: () => copyQueryToClipboard.run(node.data.id),
      },
      {type: "separator"},
      {
        label: "Rename...",
        click: () => node.edit(),
        accelerator: "Enter",
      },
      {
        label: "Delete",
        accelerator: "Backspace",
        click: () => deleteQueries.run(multi ? Array.from(ids) : [node.id]),
      },
    ]
  }
)
