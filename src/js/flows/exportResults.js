/* @flow */
import type {Thunk} from "../state/types"
import Search from "../state/Search"

export default (filePath: string): Thunk => (dispatch, getState) => {
  let args = Search.getArgs(getState())
  console.log(args)
  console.log("exporting", filePath)
}
