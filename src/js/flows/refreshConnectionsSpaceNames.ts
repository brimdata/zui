import {Thunk} from "../state/types"
import Clusters from "../state/Clusters"
import Spaces from "../state/Spaces"

export default function refreshConnectionsSpaceNames(): Thunk<Promise<void[]>> {
  return (dispatch, getState, {globalDispatch, createZealot}) => {
    const clusters = Clusters.all(getState())
    return Promise.all(
      clusters.map((c) => {
        const zealot = createZealot(`${c.host}:${c.port}`)
        return zealot.spaces.list().then((spaces) => {
          const addSpaces = spaces || []
          if (c.id) globalDispatch(Spaces.setSpaces(c.id, addSpaces))
        })
      })
    )
  }
}
