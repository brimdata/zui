import {useDispatch} from "react-redux"
import Inspector from "src/js/state/Inspector"

export function useExpandState() {
  const dispatch = useDispatch()

  return {
    expandAll() {
      dispatch(Inspector.setAllExpanded(true))
    },
    collapseAll() {
      dispatch(Inspector.setAllExpanded(false))
    }
  }
}
