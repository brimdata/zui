import {Thunk} from "../state/types"
import Current from "../state/Current"
import refreshSpaceNames from "./refreshSpaceNames"
import {getZealot} from "./getZealot"
import {lakePath} from "app/router/utils/paths"

type Props = {
  name: string
  kind: "archivestore" | "filestore"
  data_path: string
}

export const createSpace = ({
  name,
  kind,
  data_path
}: Props): Thunk<Promise<void>> => (dispatch) => {
  const zealot = dispatch(getZealot())
  return zealot.spaces
    .create({
      name,
      storage: {kind},
      data_path: data_path.length ? data_path : undefined
    })
    .then((space) => {
      dispatch(refreshSpaceNames()).then(() =>
        global.tabHistory.push(lakePath(space.id, Current.getWorkspaceId()))
      )
    })
}
