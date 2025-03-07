import {ViewHandler} from "src/core/view-handler"
import Appearance from "src/js/state/Appearance"

export class RightPaneHandler extends ViewHandler {
  onDrag(e: React.MouseEvent) {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    this.dispatch(Appearance.resizeSecondarySidebar(Math.min(width, max)))
  }
}
