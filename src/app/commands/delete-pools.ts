import {showMessageBox} from "src/js/lib/System"
import {createCommand} from "./command"

const one = "Are you sure you want to delete this pool?"
const many = (n: number) => `Are you sure you want to delete these ${n} pools?`

export const deletePools = createCommand(
  "deleteAllPools",
  async ({api}, ids: string[]) => {
    const {response} = await showMessageBox({
      type: "warning",
      title: "Delete All Pools",
      message: ids.length === 1 ? one : many(ids.length),
      buttons: ["OK", "Cancel"],
    })

    if (response !== 0) return

    const call = api.pools.delete(ids)
    api.toast.promise(call, {
      loading: "Deleting pools...",
      success: `Deleted ${ids.length} pool${ids.length > 1 ? "s" : ""}`,
      error: "Error deleting pools",
    })
  }
)
