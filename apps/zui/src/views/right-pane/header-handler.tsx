import {capitalize} from "lodash"
import {ViewHandler} from "src/core/view-handler"
import Layout from "src/js/state/Layout"
import {PaneName} from "src/js/state/Layout/types"

const SECTIONS: PaneName[] = ["history", "detail", "correlations", "columns"]

export class HeaderHandler extends ViewHandler {
  constructor(public name: PaneName) {
    super()
  }

  get options() {
    return SECTIONS.map((name) => this.createOption(name))
  }

  createOption(value: PaneName) {
    return {
      label: capitalize(value),
      click: () => this.onChange(value),
      checked: this.name === value,
    }
  }

  onChange(name: PaneName) {
    if (name === this.name) return
    this.dispatch(Layout.setCurrentPaneName(name))
  }
}
