import {flashElement} from "src/app/commands/flash-element"
import {createHandler} from "src/core/handlers"
import Appearance from "src/js/state/Appearance"
import Layout from "src/js/state/Layout"

createHandler("panes.activate", ({select, dispatch}, name) => {
  if (
    select(Appearance.secondarySidebarIsOpen) &&
    select(Layout.getCurrentPaneName) === name
  ) {
    flashElement.run(`[data-section-tab-value='${name}']`)
  } else {
    dispatch(Appearance.showSecondarySidebar())
    dispatch(Layout.setCurrentPaneName(name))
  }
})
