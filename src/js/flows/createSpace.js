/* @flow */
import type {Thunk} from "../state/types"
import Search from "../state/Search"
import refreshSpaceNames from "./refreshSpaceNames"

type Props = {
  name: string,
  kind: string,
  data_path: string
}

export const createSpace = ({name, kind, data_path}: Props): Thunk => async (
  dispatch,
  getState,
  {zealot}
) => {
  return zealot.spaces
    .create({
      name,
      storage: {kind},
      data_path: data_path.length ? data_path : undefined
    })
    .then((space) =>
      dispatch(refreshSpaceNames()).then(() =>
        dispatch(Search.setSpace(space.id))
      )
    )
}
