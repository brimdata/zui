import {TypeDefs} from "@brimdata/zealot"
import {Thunk} from "../types"
import Columns from "./"
import {createColumnPrefs} from "./models/columnPrefs"
import {createColumnSet} from "./models/columnSet"
import selectors from "./selectors"

export default (columns: TypeDefs): Thunk => (dispatch, getState) => {
  const set = createColumnSet(columns)
  const name = set.getName()
  const cols = set.getUniqColumns()
  const prefs = createColumnPrefs(selectors.getColumns(getState())[name])

  const defaults = prefs.getDefaults(cols)
  dispatch(Columns.updateColumns(name.toString(), defaults))
}
