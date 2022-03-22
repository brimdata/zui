import {nanoid} from "@reduxjs/toolkit"
import {TreeApi} from "react-arborist"
import ReactDOM from "react-dom"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Queries from "src/js/state/Queries"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"

export const listContextMenu = (tree: TreeApi<any>): Thunk => (
  dispatch,
  getState
) => {
  const lakeId = Current.getLakeId(getState())

  showContextMenu([
    {
      label: "New Query",
      click: () => {
        const id = nanoid()
        dispatch(Queries.addItem({id, name: "New query", value: ""}))
        ReactDOM.flushSync(async () => {
          const {cancelled} = await tree.edit(id)
          if (!cancelled) {
            tree.selectById(id)
            dispatch(Tabs.activateByUrl(lakeQueryPath(id, lakeId)))
          }
        })
      }
    },
    {
      label: "New Folder",
      click: () => {
        const id = nanoid()
        const group = {
          id,
          name: "New Folder",
          items: [],
          isOpen: true
        }
        dispatch(Queries.addItem(group))
        tree.edit(id)
      }
    }
  ])
}
