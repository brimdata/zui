import {showMessageBox} from "src/js/lib/System"
import {createCommand} from "./command"

const one = {
  title: "Delete Query",
  message: "Are you sure you want to delete this query?",
}

const many = (n) => ({
  title: `Delete ${n} Queries`,
  message: `Are you sure you want to delete these ${n} queries?`,
})

export const deleteQueries = createCommand(
  "deleteQueries",
  async ({api}, ids: string[]) => {
    const n = ids.length
    const config = n === 1 ? one : many(n)
    const resp = await showMessageBox({
      ...config,
      type: "warning",
      buttons: ["OK", "Cancel"],
    })
    if (resp.response === 0) {
      api.queries.delete(ids)
      api.toast(`Deleted ${n} ${n > 1 ? "queries" : "query"}`)
    }
  }
)
