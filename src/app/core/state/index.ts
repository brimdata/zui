import {useDispatch as useReduxDispatch} from "react-redux"
import {AppDispatch} from "src/js/state/types"

export function useDispatch() {
  return useReduxDispatch<AppDispatch>()
}
