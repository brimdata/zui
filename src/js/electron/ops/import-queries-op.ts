import Queries from "src/js/state/Queries"
import {isGroup, isQuery} from "src/js/state/Queries/helpers"
import {parseJSONLib} from "src/js/state/Queries/parsers"
import QueryVersions from "src/js/state/QueryVersions"
import {createOperation} from "../operations"

export const importQueriesOp = createOperation(
  "importQueries",
  ({main}, filepath: string) => {
    let json
    try {
      json = parseJSONLib(filepath)
    } catch {
      return ["File is not JSON", 0]
    }
    const {libRoot, versions} = json
    if (!isValidQueryGroup(libRoot)) {
      return ["Incorrect query format", 0]
    }

    main.store.dispatch(Queries.addItem(libRoot, "root"))

    for (let queryId in versions) {
      const version = versions[queryId]
      main.store.dispatch(QueryVersions.at(queryId).sync([version]))
    }
    console.log(Object.keys(versions))
    return [null, Object.keys(versions).length]
  }
)

function isValidQueryGroup(obj: unknown) {
  return isGroup(obj) || isQuery(obj)
}
