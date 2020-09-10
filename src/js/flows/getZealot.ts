import Current from "../state/Current"
import {Thunk, Zealot} from "../state/types"

export const getZealot = (): Thunk<Zealot> => (
  _dispatch,
  getState,
  {createZealot}
) => {
  return createZealot(Current.getConnectionId(getState()))
}
