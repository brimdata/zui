import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {useExpandState} from "../../results/expand-hook"
import {ActionButtonProps} from "../actions/action-button"

export const useInspectorButtons = (): ActionButtonProps[] => {
  const {expandAll, collapseAll} = useExpandState()
  const view = useSelector(Layout.getResultsView)

  const disabled = view !== "INSPECTOR"
  return [
    {
      label: "Expand",
      title: "Expand all inspector view entries",
      icon: "expand",
      disabled,
      click: () => expandAll(),
    },
    {
      label: "Collapse",
      title: "Collapse all inspector view entries",
      icon: "collapse",
      disabled,
      click: () => collapseAll(),
    },
  ]
}
