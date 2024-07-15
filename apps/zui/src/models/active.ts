import {DomainModel} from "src/core/domain-model"
import {SessionLocation} from "./session-location"
import Current from "src/js/state/Current"
import {EditorSnapshot} from "./editor-snapshot"
import {BrowserTab} from "./browser-tab"
import {Frame} from "./frame"
import {getActiveTab} from "src/js/state/Tabs/selectors"
import Editor from "src/js/state/Editor"
import {Lake} from "./lake"

export class Active extends DomainModel {
  static get tab() {
    const {id, lastFocused} = this.select(getActiveTab)
    return new BrowserTab({id, lastFocused})
  }

  static get session() {
    const params = this.select(Current.getQueryUrlParams)
    return new SessionLocation({
      id: this.tab.attrs.id,
      parentId: params.queryId,
      snapshotId: params.version,
    })
  }

  static get snapshot() {
    const params = this.select(Current.getQueryUrlParams)

    return new EditorSnapshot({
      parentId: params.queryId,
      ...this.select(Editor.getSnapshot),
    })
  }

  static get frame() {
    return new Frame({
      id: globalThis.windowId,
    })
  }

  static get lake() {
    const id = this.select(Current.getLakeId)
    return Lake.find(id)
  }
}
