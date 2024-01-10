import {Pool} from "../core/pools/pool"
import {createMenu} from "src/core/menu"
import {chooseFiles} from "src/domain/loads/handlers"

export const poolToolbarMenu = createMenu(({api}, pool: Pool) => {
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
        api.queries.open({
          pins: [{type: "from", value: pool.name}],
          value: "",
        })
      },
      title: "Open a new session query with this pool as the from clause.",
    },
  ]
})
