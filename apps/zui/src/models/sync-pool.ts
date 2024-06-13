import lake from "src/js/models/lake"
import Current from "src/js/state/Current"
import Lakes from "src/js/state/Lakes"
import Pools from "src/js/state/Pools"
import {Thunk} from "src/js/state/types"
import {Pool} from "./pool"

export const syncPool =
  (poolId: string, lakeId?: string): Thunk<Promise<Pool | null>> =>
  async (dispatch, getState, {api}) => {
    const lakeModel = lakeId
      ? lake(Lakes.id(lakeId)(getState()))
      : Current.getLake(getState())

    const zealot = await api.getZealot(lakeModel)

    return Promise.all([zealot.getPool(poolId), zealot.getPoolStats(poolId)])
      .then(([data, stats]) => {
        dispatch(Pools.setData({lakeId: lakeModel.id, data}))
        dispatch(Pools.setStats({lakeId: lakeModel.id, poolId: data.id, stats}))
        return new Pool(data, stats)
      })
      .catch((error) => {
        console.error(error)
        return null
      })
  }
