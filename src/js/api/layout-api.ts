import {flashElement} from "src/app/commands/flash-element"
import Layout from "../state/Layout"
import {PaneName} from "../state/Layout/types"
import {ApiDomain} from "./api-domain"
import Appearance from "../state/Appearance"

export class LayoutApi extends ApiDomain {
  activatePane(name: PaneName) {
    const {state, dispatch} = this
    if (
      Appearance.secondarySidebarIsOpen(state) &&
      Layout.getCurrentPaneName(state) === name
    ) {
      flashElement.run(`[data-section-tab-value='${name}']`)
    } else {
      dispatch(Appearance.showSecondarySidebar())
      dispatch(Layout.setCurrentPaneName(name))
    }
  }
}
