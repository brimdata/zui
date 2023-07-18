import {createMenu} from "src/core/menu/menu-node"
import * as results from "./commands"
import * as panes from "../panes/commands"
import {PaneName} from "src/js/state/Layout/types"

createMenu("results.toolbarMenu", [
  {
    label: "Expand",
    description: "Expand all container values",
    iconName: "expand",
    command: results.expandAll.id,
    when: "results.view == inspector",
  },
  {
    label: "Collapse",
    description: "Collapse all container values",
    iconName: "collapse",
    command: results.collapseAll.id,
  },
  {
    label: "Export",
    description: "Export search results to file",
    iconName: "export",
    command: results.showExportDialog.id,
  },
  {
    label: "Columns",
    description: "Show or hide columns in the table",
    iconName: "columns",
    command: panes.activate.id,
    args: ["columns" as PaneName],
  },
  {
    label: "Histogram",
    iconName: "chart",
    description: "Toggle the histogram",
    command: results.toggleHistogram.id,
  },
])
