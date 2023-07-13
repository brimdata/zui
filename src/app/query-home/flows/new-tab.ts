import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"

export const newTab = (): Thunk => (dispatch) => {
  dispatch(Tabs.createQuerySession())
}
