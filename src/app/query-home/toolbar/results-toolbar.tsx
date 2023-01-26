import React from "react"
import {useSelector} from "react-redux"
import {resultsToolbarMenu} from "src/app/menus/results-toolbar-menu"
import {ButtonMenu} from "src/components/button-menu"
import {Toolbar} from "src/components/toolbar"
import Layout from "src/js/state/Layout"
import Results from "src/js/state/Results"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import Toolbars from "src/js/state/Toolbars"
import {ResultsViewSwitch} from "./results-view-switch"

export function ResultsToolbar() {
  // This should maybe go in the results provider
  let view = useSelector(Layout.getResultsView)
  const shapesObj = useSelector(Results.getShapes(MAIN_RESULTS))
  const isSingleShape = Object.values(shapesObj).length === 1
  if (!isSingleShape) view = "INSPECTOR"

  useSelector(Toolbars.allToolbarItems("search")) // Re-render when these plugin items change

  return (
    <Toolbar>
      <ResultsViewSwitch />
      <ButtonMenu menu={resultsToolbarMenu.build(view)} />
    </Toolbar>
  )
}
