import * as hds from "./handlers"
import * as ops from "./operations"

export type EditorHandlers = {
  "editor.copyValueToClipboard": typeof hds.copyValueToClipboard
  "editor.countByField": typeof hds.countByField
  "editor.filterEqualsValue": typeof hds.filterEqualsValue
  "editor.filterNotEqualsValue": typeof hds.filterNotEqualsValue
  "editor.filterInField": typeof hds.filterInField
  "editor.filterNotInField": typeof hds.filterNotInField
  "editor.newSearchWithValue": typeof hds.newSearchWithValue
  "editor.pivotToValues": typeof hds.pivotToValues
  "editor.sortAsc": typeof hds.sortAsc
  "editor.sortDesc": typeof hds.sortDesc
  "editor.fuse": typeof hds.fuse
}

export type EditorOperations = {
  "editor.describe": typeof ops.describe
}
