import {debounce} from "lodash"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import {ViewHandler} from "src/core/view-handler"
import {submitSearch} from "src/domain/session/handlers"
import Config from "src/js/state/Config"
import Editor from "src/js/state/Editor"
import {Active} from "src/models/active"

export class EditorHandler extends ViewHandler {
  onChange(value) {
    this.dispatch(Editor.setValue(value))
    this.dispatch(Editor.setMarkers([]))
    this.throttledValidate()
  }

  onKey(e: React.KeyboardEvent) {
    const isEnterKey = e.key === "Enter"
    const isModKey = e.shiftKey || cmdOrCtrl(e)
    const runOnEnter = this.select(Config.getRunOnEnter)
    if (isEnterKey) {
      if ((runOnEnter && !isModKey) || (!runOnEnter && isModKey)) {
        e.preventDefault()
        submitSearch()
      }
    }
  }

  private async validate() {
    const {snapshot} = Active
    if (await snapshot.isValid()) {
      this.dispatch(Editor.setMarkers([]))
    } else {
      this.dispatch(Editor.setMarkers(snapshot.errors))
    }
  }

  private throttledValidate = debounce(this.validate.bind(this), 150, {
    leading: true,
  })
}
