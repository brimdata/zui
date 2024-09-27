import Queries from "src/js/state/Queries"
import {serializeQueryLib} from "src/js/state/Queries/parsers"
import {createOperation} from "../../core/operations"
import fs from "fs-extra"

export const exportQueryGroupOp = createOperation(
  "exportQueries",
  ({main}, groupId: string, filePath: string) => {
    const state = main.store.getState()
    const group = Queries.getGroupById(groupId)(state)
    const json = serializeQueryLib(group)
    return fs.writeJSON(filePath, json)
  }
)
