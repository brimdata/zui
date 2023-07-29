import {copyToClipboard} from "src/js/lib/doc"
import Queries from "src/js/state/Queries"
import {createCommand} from "./command"

export const copyQueryToClipboard = createCommand(
  "copyQueryToClipboard",
  ({api, getState}, id: string) => {
    const q = Queries.build(getState(), id)
    if (q) {
      copyToClipboard(q.toString())
      api.toast("Copied")
    }
  }
)
