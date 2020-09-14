import {Thunk} from "../state/types"
import deletePartialSpaces from "./deletePartialSpaces"
import saveWindowState from "./saveWindowState"

export default (): Thunk<Promise<void>> => (dispatch) => {
  return dispatch(deletePartialSpaces()).then(() => {
    return dispatch(saveWindowState())
  })
}
