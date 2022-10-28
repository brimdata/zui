import {showMessageBox} from "src/js/lib/System"
import {createCommand} from "./command"

const one = "Are you sure you want to delete this pool?"
const many = (n: number) => `Are you sure you want to delete these ${n} pools?`

export const deletePools = createCommand(
  "deleteAllPools",
  ({api}, ids: string[]) => {
    showMessageBox({
      type: "warning",
      title: "Delete All Pools",
      message: ids.length === 1 ? one : many(ids.length),
      buttons: ["OK", "Cancel"],
    }).then(async ({response}) => {
      if (response === 0) {
        await api.pools.delete(ids)
        api.toast(`Deleted ${ids.length} pool${ids.length > 1 ? "s" : ""}`)
      }
    })
  }
)
