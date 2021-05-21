import * as locators from "src/js/test/locators"
import {quote} from "./utils"

export default class BrimSelectors {
  toolbarView = `button[aria-label="View"]`
  detailPane = locators.detailPane.css
  detailPaneSections = this.detailPane + " h4"

  viewerCellContaining(text) {
    return (
      locators.viewerResults.xpath + `//span[contains(text(), ${quote(text)})]`
    )
  }
}
