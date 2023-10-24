import {MainObject} from "src/core/main/main-object"
import {setOperationContext} from "src/core/operations"
// Importing these will set up the listeners
import "src/domain/operations"
import "src/electron/ops"

export function runOperations(main: MainObject) {
  setOperationContext({main})
}
