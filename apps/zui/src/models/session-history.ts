import {DomainModel} from "src/core/domain-model"
import SessionHistories from "src/js/state/SessionHistories"
import {EditorSnapshot} from "./editor-snapshot"

type Attrs = {
  id: string
}

export class SessionHistory extends DomainModel<Attrs> {
  push(snapshot: EditorSnapshot) {
    this.dispatch(
      SessionHistories.pushById({
        sessionId: this.attrs.id,
        entry: {
          queryId: snapshot.attrs.parentId,
          version: snapshot.attrs.version,
        },
      })
    )
  }
}
