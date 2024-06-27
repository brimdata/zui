import {DomainModel} from "src/core/domain-model"
import SessionHistories from "src/js/state/SessionHistories"

type Attrs = {
  id: string
}

export class SessionHistory extends DomainModel<Attrs> {
  get id() {
    return this.attrs.id
  }

  push(parentId: string, snapshotId: string) {
    this.dispatch(
      SessionHistories.pushById({
        sessionId: this.attrs.id,
        entry: {
          queryId: parentId,
          version: snapshotId,
        },
      })
    )
  }

  get entries() {
    return this.select(SessionHistories.getById(this.id)) || []
  }

  contains(parentId: string, snapshotId: string) {
    return !!this.entries.find(
      (item) => item.queryId === parentId && item.version === snapshotId
    )
  }
}
