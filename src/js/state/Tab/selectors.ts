import {createSelector} from "reselect"
import Current from "../Current"
import {Lake} from "../Lakes/types"
import {State} from "../types"
import activeTabSelect from "./activeTabSelect"

const lakeUrl = createSelector<State, Lake | null, string>(
  Current.getLake,
  (c) => {
    if (c) return c.host + ":" + c.port
    else return "localhost:9867"
  }
)

const getLastLocationKey = activeTabSelect((t) => t.lastLocationKey)

export default {
  lakeUrl,
  getPoolName: (state: State) => {
    const s = Current.mustGetPool(state)
    return s ? s.name : ""
  },
  getLastLocationKey,
}
