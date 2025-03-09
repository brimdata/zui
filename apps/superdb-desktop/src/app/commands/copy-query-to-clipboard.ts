import {copyToClipboard} from "src/js/lib/doc"
import Queries from "src/js/state/Queries"
import {createCommand} from "./command"
import {Snapshot} from "src/models/snapshot"

export const copyQueryToClipboard = createCommand(
  "copyQueryToClipboard",
  ({api, getState}, id: string) => {
    const query = Queries.find(getState().queries, id)
    if (query) {
      const text = new Snapshot(query).queryText
      copyToClipboard(text)
      api.toast("Copied")
    }
  }
)
