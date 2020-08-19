/* @flow */
import type {Thunk} from "../state/types"
import refreshSpaceNames from "./refreshSpaceNames"
import Current from "../state/Current"

const deleteSpace = (name: string): Thunk => (
  dispatch,
  getState,
  {createZealot}
) => {
  const zealot = createZealot(Current.getConnectionId(getState()))
  return zealot.spaces.delete(name).then(() => {
    dispatch(refreshSpaceNames())
  })
}

export default deleteSpace
