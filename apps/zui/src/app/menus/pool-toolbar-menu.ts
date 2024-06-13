import {Pool} from "../../models/pool"
import {createMenu} from "src/core/menu"
import {Snapshots} from "src/domain/handlers"
import {chooseFiles} from "src/domain/loads/handlers"

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
        Snapshots.createAndShow({
          pins: [{type: "from", value: pool.name}],
          value: "",
        })
      },
      title: "Open a new session query with this pool as the from clause.",
    },
  ]
})
