import brim from "src/js/brim"
import {getZealot} from "src/js/flows/getZealot"
import Current from "src/js/state/Current"
import Lakes from "src/js/state/Lakes"
import Pools from "src/js/state/Pools"
import {Thunk} from "src/js/state/types"

/**
 * This only gets the list of names from the server.
 */
export function syncPoolsData(lakeId?: string): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const lake = lakeId
      ? brim.lake(Lakes.id(lakeId)(getState()))
      : Current.getLake(getState())

    const zealot = await dispatch(getZealot(lake))

    return zealot.getPools().then((allData) => {
      dispatch(Pools.setAllData({lakeId: lake.id, allData}))
    })
  }
}
