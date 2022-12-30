import {useSelector} from "react-redux"
import {MenuItem} from "src/core/menu"
import Layout from "src/js/state/Layout"
import {useExpandState} from "../../results/expand-hook"

export const useInspectorButtons = (): MenuItem[] => {
  const {expandAll, collapseAll} = useExpandState()
  const view = useSelector(Layout.getResultsView)

  const enabled = view === "INSPECTOR"
  return [
    {
      label: "Expand",
      description: "Expand all inspector view entries",
      iconName: "expand",
      enabled,
      click: () => expandAll(),
    },
    {
      label: "Collapse",
      description: "Collapse all inspector view entries",
      iconName: "collapse",
      enabled,
      click: () => collapseAll(),
    },
  ]
}
