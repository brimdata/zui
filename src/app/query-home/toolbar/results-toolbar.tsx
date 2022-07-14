import React from "react"
import {Toolbar} from "../results/results.styled"
import useColumns from "./hooks/use-columns"
import useExport from "./hooks/use-export"
import {useInspectorButtons} from "./hooks/use-inspector"
import usePins from "./hooks/use-pins"
import usePluginToolbarItems from "./hooks/use-plugin-toolbar-items"

export function ResultsToolbar() {
  const exportAction = useExport()
  const columns = useColumns()
  const pin = usePins()
  const pluginButtons = usePluginToolbarItems("search")
  const [expandButton, collapseButton] = useInspectorButtons()
  const actions = [
    ...pluginButtons,
    expandButton,
    collapseButton,
    exportAction,
    columns,
    pin,
  ]
  return <Toolbar actions={actions} />
}
