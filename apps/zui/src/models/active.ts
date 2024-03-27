import {DomainModel} from "src/core/domain-model"
import {Session} from "./session"
import Current from "src/js/state/Current"
import {EditorSnapshot} from "./editor-snapshot"
import {BrowserTab} from "./browser-tab"
import Editor from "src/js/state/Editor"
import {Frame} from "./frame"
import {getActiveTab} from "src/js/state/Tabs/selectors"

export class Active extends DomainModel {
  static get tab() {
    const {id, lastFocused} = this.select(getActiveTab)
    return new BrowserTab({id, lastFocused})
  }

  static get session() {
    const params = this.select(Current.getQueryUrlParams)
    return new Session({
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
}
