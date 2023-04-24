import Queries from "src/js/state/Queries"
import {isGroup, isQuery} from "src/js/state/Queries/helpers"
import {parseJSONLib} from "src/js/state/Queries/parsers"
import QueryVersions from "src/js/state/QueryVersions"
import {createOperation} from "../../../core/operations"

export const importQueriesOp = createOperation(
  "importQueries",
  ({main}, filepath: string): {error: string} | {size: number; id: string} => {
    let json
    try {
      json = parseJSONLib(filepath)
    } catch {
      return {error: "File is not JSON"}
    }
    const {libRoot, versions} = json
    if (!isValidQueryGroup(libRoot)) {
      return {error: "Incorrect query format"}
    }

    main.store.dispatch(Queries.addItem(libRoot, "root"))

    for (let queryId in versions) {
      const version = versions[queryId]
      main.store.dispatch(QueryVersions.at(queryId).sync([version]))
    }

    return {size: Object.keys(versions).length, id: libRoot.id}
  }
)

function isValidQueryGroup(obj: unknown) {
  return isGroup(obj) || isQuery(obj)
}
