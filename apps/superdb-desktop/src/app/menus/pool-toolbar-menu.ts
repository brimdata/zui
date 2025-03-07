import {Pool} from "../../models/pool"
import {createMenu} from "src/core/menu"
import {chooseFiles} from "src/domain/loads/handlers"
import {QuerySession} from "src/models/query-session"

export const poolToolbarMenu = createMenu((_, pool: Pool) => {
  return [
    {
      display: "icon-label",
      label: "Load Data",
      iconName: "file_upload",
      click: async () => {
        chooseFiles(pool.id)
      },
      title: "Load data into this pool.",
    },
    {
      display: "icon-label",
      label: "Query Pool",
      iconName: "query",
      click: () => {
        QuerySession.activateOrCreate().navigate({
          pins: [{type: "from", value: pool.name}],
          value: "",
        })
      },
      title: "Open a new session query with this pool as the from clause.",
    },
  ]
})
