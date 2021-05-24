import {Thunk} from "../state/types"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"

export default function refreshPoolInfo(): Thunk {
  return () => (dispatch, getState) => {
    const zealot = dispatch(getZealot())
    const id = Current.getPoolId(getState())

    let config = {}
    let stats = {}
    Promise.all([
      zealot.pools.get(id).then((data: any) => {
        config = data
      }),
      zealot.pools.stats(id).then((data: any) => {
        stats = data
      })
    ]).then(() => {
      const id = Current.getWorkspaceId(getState())
      if (!id) return
      dispatch(Pools.setDetail(id, {...config, ...stats}))
    })
  }
}
