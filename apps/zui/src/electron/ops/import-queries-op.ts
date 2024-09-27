import Queries from "src/js/state/Queries"
import {isGroup, isQuery} from "src/js/state/Queries/helpers"
import {parseJSONLib} from "src/js/state/Queries/parsers"
import {createOperation} from "../../core/operations"

export const importQueriesOp = createOperation(
  "importQueries",
  ({main}, filepath: string): {error: string} | {size: number; id: string} => {
    let json
    try {
      json = parseJSONLib(filepath)
    } catch {
      return {error: "File is not JSON"}
    }
    const {libRoot} = json
    if (!isValidQueryGroup(libRoot)) {
      return {error: "Incorrect query format"}
    }

    main.store.dispatch(Queries.addItem(libRoot, "root"))

    // TODO: TEST THIS FUNCTION AND FIX
    return {size: 0, id: libRoot.id}
  }
)

function isValidQueryGroup(obj: unknown) {
  return isGroup(obj) || isQuery(obj)
}
