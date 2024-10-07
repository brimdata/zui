import Queries from "src/js/state/Queries"
import {serializeQueryLib} from "src/js/state/Queries/parsers"

export const queriesExport = (groupId: string) => (dispatch, getState) => {
  const group = Queries.getGroupById(groupId)(getState())
  return serializeQueryLib(group)
}
