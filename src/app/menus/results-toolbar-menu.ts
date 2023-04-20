import {IconName} from "src/app/core/icon-temp"
import {createMenu, MenuItem} from "src/core/menu"
import Inspector from "src/js/state/Inspector"
import {ResultsView} from "src/js/state/Layout/types"
import Modal from "src/js/state/Modal"
import Table from "src/js/state/Table"
import Toolbars from "src/js/state/Toolbars"

export const resultsToolbarMenu = createMenu(
  "resultsToolbarMenu",
  ({api}, view: ResultsView) => {
    const dispatch = api.dispatch
    const pluginItems = Toolbars.allToolbarItems("search")(api.getState())
    const isInspector = view === "INSPECTOR"
    const plugins = pluginItems.map(
      ({label, command, disabled, icon, tooltip, buttonProps}): MenuItem => {
        return {
          label,
          enabled: !disabled,
          iconName: icon as IconName,
          description: tooltip,
          click: () => {
            throw new Error("Fix me" + command)
          },
          htmlAttrs: buttonProps,
        }
      }
    )

    return [
      ...plugins,
      {
        label: "Expand",
        description: "Expand all container values",
        iconName: "expand",
        enabled: isInspector,
        click: () => {
          dispatch(Inspector.setExpanded({}))
          dispatch(Inspector.setExpandedDefault(true))
        },
      },
      {
        label: "Collapse",
        description: "Collapse all container values",
        iconName: "collapse",
        click: () => {
          if (view === "INSPECTOR") {
            dispatch(Inspector.setExpanded({}))
            dispatch(Inspector.setExpandedDefault(false))
          } else {
            dispatch(Table.setValueExpanded({}))
          }
        },
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
        click: () => {
          api.layout.activatePane("columns")
        },
      },
    ]
  }
)
