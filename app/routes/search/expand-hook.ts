import {collapseAll, expandAll} from "app/features/inspector/handlers"
import {useDispatch} from "react-redux"

export function useExpandState() {
  const dispatch = useDispatch()

  return {
    expandAll() {
      dispatch(expandAll())
    },
    collapseAll() {
      dispatch(collapseAll())
    }
  }
}
