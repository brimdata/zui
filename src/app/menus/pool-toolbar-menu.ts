import {Pool} from "../core/pools/pool"
import {createMenu} from "src/core/menu"

export const poolToolbarMenu = createMenu(
  "poolToolbarMenu",
  ({api}, pool: Pool) => {
    return [
      {
        label: "Query Pool",
        icon: "query",
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
