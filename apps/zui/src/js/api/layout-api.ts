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
      dispatch(Appearance.toggleSecondarySidebar())
    } else {
      dispatch(Appearance.showSecondarySidebar())
      dispatch(Layout.setCurrentPaneName(name))
    }
  }
}
