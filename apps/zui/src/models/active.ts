import {DomainModel} from "src/core/domain-model"
import {Session} from "./session"
import Current from "src/js/state/Current"

export class Active extends DomainModel<void> {
  static get session() {
    const params = this.select(Current.getQueryUrlParams)

    return new Session({
      id: this.select(Current.getTabId),
      queryId: params.queryId,
      editorSnapshotId: params.version,
    })
  }
}
