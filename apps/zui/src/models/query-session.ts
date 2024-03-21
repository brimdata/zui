import {MemoryHistory} from "history"
import {queryPath} from "src/app/router/utils/paths"
import {DomainModel} from "src/core/domain-model"
import Inspector from "src/js/state/Inspector"
import Table from "src/js/state/Table"
import Selection from "src/js/state/Selection"

type Attrs = {
  id: string
}

export class QuerySession extends DomainModel<Attrs> {
  loadEditorSnapshot(snapshot, opts) {
    const url = queryPath(snapshot.queryId, snapshot.id)

    if (this.history.location.pathname === url) {
      this.history.replace(url)
    } else if (opts.history === "replace") {
      this.history.replace(url)
    } else {
      this.history.push(url)
    }
  }

  reset() {
    this.dispatch(Selection.reset())
    this.dispatch(Table.setScrollPosition({top: 0, left: 0}))
    this.dispatch(Inspector.setScrollPosition({top: 0, left: 0}))
  }

  

  get editorSnapshot() {
    return this.select(Current.getVer)
  }

  get history(): MemoryHistory {
    return global.tabHistories.getOrCreate(this.attrs.id)
  }
}
