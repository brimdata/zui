import LoadDataForm from "src/js/state/LoadDataForm"
import {Pool} from "../core/pools/pool"
import {createMenu} from "src/core/menu"
import {startTransition} from "react"
import {invoke} from "src/core/invoke"

export const poolToolbarMenu = createMenu(
  "poolToolbarMenu",
  ({api}, pool: Pool) => {
    return [
      {
        type: "icon-label",
        label: "Load Data",
        iconName: "doc-plain",
        click: async () => {
          const result = await invoke("window.showOpenDialog", {
            properties: ["openFile", "multiSelections"],
          })
          if (!result.canceled && result.filePaths.length) {
            startTransition(() => {
              api.dispatch(LoadDataForm.setPoolId(pool.id))
              api.dispatch(LoadDataForm.setFiles(result.filePaths))
              api.dispatch(LoadDataForm.setShow(true))
            })
          }
        },
        title: "Load data into this pool.",
      },
      {
        type: "icon-label",
        label: "Query Pool",
        iconName: "query",
        click: () => {
          api.queries.open({
            pins: [{type: "from", value: pool.name}],
            value: "",
          })
        },
        title: "Open a new session query with this pool as the from clause.",
      },
    ]
  }
)
