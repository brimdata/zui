import Queries from "src/js/state/Queries"
import {isGroup, isQuery} from "src/js/state/Queries/helpers"
import {flattenItemTree, parseJSONLib} from "src/js/state/Queries/parsers"
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

    const flatTree = flattenItemTree(libRoot)
    const size = flatTree.filter((item) => !!item.value).length
    main.store.dispatch(Queries.addItem(libRoot, "root"))

    return {size, id: libRoot.id}
  }
)

function isValidQueryGroup(obj: unknown) {
  return isGroup(obj) || isQuery(obj)
}
