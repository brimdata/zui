import {createSelector} from "@reduxjs/toolkit"
import {getIds} from "./selectors"
import Pools from "../Pools"
import Lakes from "../Lakes"
import Current from "../Current"
import Queries from "../Queries"
import tab from "src/js/models/tab"

// We need to store the title of the tab in a different way
export const getTabModels = createSelector(
  getIds,
  Pools.raw,
  Lakes.raw,
  Current.getLakeId,
  Queries.getQueryIdToName,
  Current.getLocation, // So that it re-renders on start
  (ids, pools, lakes, lakeId, queryIdToName) => {
    return ids.map((id) => tab(id, lakes, pools, queryIdToName, lakeId))
  }
)
