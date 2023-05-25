import {flashElement} from "src/app/commands/flash-element"
import {createHandler} from "src/core/handlers"
import Layout from "src/js/state/Layout"

createHandler("panes.activate", ({select, dispatch}, name) => {
  if (
    select(Layout.getDetailPaneIsOpen) &&
    select(Layout.getCurrentPaneName) === name
  ) {
    flashElement.run(`[data-section-tab-value='${name}']`)
  } else {
    dispatch(Layout.showDetailPane())
    dispatch(Layout.setCurrentPaneName(name))
  }
})
