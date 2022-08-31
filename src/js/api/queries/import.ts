import Queries from "src/js/state/Queries"
import {parseJSONLib} from "src/js/state/Queries/parsers"
import QueryVersions from "src/js/state/QueryVersions"
import {Thunk} from "src/js/state/types"

export const queriesImport =
  (file: File): Thunk =>
  (dispatch, getState, {api}) => {
    const {libRoot, versions} = parseJSONLib(file.path)
    dispatch(Queries.addItem(libRoot, "root"))
    for (let queryId in versions) {
      const version = versions[queryId]
      dispatch(QueryVersions.at(queryId).sync([version]))
    }
    api.toast.success(`Imported ${libRoot.name}`)
  }
