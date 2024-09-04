import {createSelector} from "@reduxjs/toolkit"
import {getIds} from "./selectors"
import Pools from "../Pools"
import Lakes from "../Lakes"
import Current from "../Current"
import Queries from "../Queries"
import tab from "src/js/models/tab"

export const getTabModels = createSelector(
  getIds,
  Pools.raw,
  Lakes.raw,
  Current.getLakeId,
  Queries.getQueryIdToName,
  (ids, pools, lakes, lakeId, queryIdToName) => {
    return ids.map((id) => tab(id, lakes, pools, queryIdToName, lakeId))
  }
)
