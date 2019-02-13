/* @flow */

import AutoLayout from "./AutoLayout"

export default class LayoutFixed extends AutoLayout {
  viewHeight() {
    return this.height - this.rowH
  }

  listWidth() {
    if (typeof this.rowW === "number") {
      return Math.max(this.rowW, this.viewWidth())
    } else {
      return this.viewWidth()
    }
  }
}
