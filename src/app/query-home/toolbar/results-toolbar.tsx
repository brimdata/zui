import React from "react"
import {resultsToolbarMenu} from "src/app/menus/results-toolbar-menu"
import {ButtonMenu} from "src/components/button-menu"
import {Toolbar} from "src/components/toolbar"
import {ResultsViewSwitch} from "./results-view-switch"

export function ResultsToolbar() {
  return (
    <Toolbar>
      <ResultsViewSwitch />
      <ButtonMenu menu={resultsToolbarMenu.build()} />
    </Toolbar>
  )
}
