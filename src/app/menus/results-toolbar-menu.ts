import {IconName} from "src/app/core/icon-temp"
import {createMenu, MenuItem} from "src/core/menu"
import {executeCommand} from "src/js/flows/executeCommand"
import Inspector from "src/js/state/Inspector"
import Layout from "src/js/state/Layout"
import Modal from "src/js/state/Modal"
import Toolbars from "src/js/state/Toolbars"

export const resultsToolbarMenu = createMenu("resultsToolbarMenu", ({api}) => {
  const dispatch = api.dispatch
  const view = Layout.getResultsView(api.getState())
  const pluginItems = Toolbars.allToolbarItems("search")(api.getState())
  const isInspector = view === "INSPECTOR"

  const plugins = pluginItems.map(
    ({label, command, disabled, icon, tooltip, buttonProps}): MenuItem => {
      return {
        label,
        enabled: !disabled,
        iconName: icon as IconName,
        description: tooltip,
        click: () => dispatch(executeCommand(command)),
        htmlAttrs: buttonProps,
      }
    }
  )

  return [
    ...plugins,
    {
      label: "Expand",
      description: "Expand all inspector view entries",
      iconName: "expand",
      enabled: isInspector,
      click: () => dispatch(Inspector.setAllExpanded(true)),
    },
    {
      label: "Collapse",
      description: "Collapse all inspector view entries",
      iconName: "collapse",
      enabled: isInspector,
      click: () => dispatch(Inspector.setAllExpanded(false)),
    },
    {
      label: "Export",
      description: "Export search results to file",
      iconName: "export",
      click: () => api.dispatch(Modal.show("export")),
    },
    {
      label: "Columns",
      description: "Show or hide columns in the table",
      iconName: "columns",
      click: () => dispatch(Modal.show("columns")),
    },
  ]
})
