import {forEach} from "lodash"
import Queries from "src/js/state/Queries"
import {parseJSONLib} from "src/js/state/Queries/parsers"
import QueryVersions from "src/js/state/QueryVersions"
import {Thunk} from "src/js/state/types"

export const queriesImport =
  (file: File): Thunk =>
  (dispatch, getState, {api}) => {
    const {libRoot, versions} = parseJSONLib(file.path)
    dispatch(Queries.addItem(libRoot, "root"))
    forEach(versions, (vs, queryId) => {
      dispatch(QueryVersions.at(queryId).sync(vs))
    })
    api.toast.success(`Imported ${libRoot.name}`)
  }
