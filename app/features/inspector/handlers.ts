import Inspector from "src/js/state/Inspector"
// Don't need this file anymore
export const expandAll = () => (dispatch) => {
  dispatch(Inspector.setAllExpanded(true))
}

export const collapseAll = () => (dispatch) => {
  dispatch(Inspector.setAllExpanded(false))
}
