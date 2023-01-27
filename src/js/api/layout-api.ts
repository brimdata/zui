import {flashElement} from "src/app/commands/flash-element"
import Layout from "../state/Layout"
import {PaneName} from "../state/Layout/types"
import {ApiDomain} from "./api-domain"

export class LayoutApi extends ApiDomain {
  activatePane(name: PaneName) {
    const {state, dispatch} = this
    if (
      Layout.getDetailPaneIsOpen(state) &&
      Layout.getCurrentPaneName(state) === name
    ) {
      flashElement.run(`[data-section-tab-value='${name}']`)
    } else {
      dispatch(Layout.showDetailPane())
      dispatch(Layout.setCurrentPaneName(name))
    }
  }
}
