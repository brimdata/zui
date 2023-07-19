import Queries from "src/js/state/Queries"
import {serializeQueryLib} from "src/js/state/Queries/parsers"
import QueryVersions from "src/js/state/QueryVersions"

export const queriesExport = (groupId: string) => (dispatch, getState) => {
  const group = Queries.getGroupById(groupId)(getState())
  const versions = QueryVersions.raw(getState())
  return serializeQueryLib(group, versions)
}
