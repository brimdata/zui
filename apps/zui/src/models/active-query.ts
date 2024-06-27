import {QueryModel} from "src/js/models/query-model"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {EditorSnapshot} from "src/models/editor-snapshot"

export class ActiveQuery {
  constructor(
    public session: QueryModel, // the singleton for the tab
    public query: QueryModel | null, // the query from the url param
    public version: QueryVersion | null // the version from the url param
  ) {}

  id() {
    return this.query?.id || this.session.id
  }

  versionId() {
    return this.version?.version || null
  }

  isDeleted() {
    return !this.query && !this.version
  }

  isAnonymous() {
    return !this.query || this.query.id === this.session.id
  }

  isSaved() {
    return !this.isAnonymous()
  }

  isLatest() {
    return (
      !this.isAnonymous() && this.query.latestVersionId() === this.versionId()
    )
  }

  isModified() {
    return !this.isAnonymous() && !this.isLatest()
  }

  isOutdated() {
    return !this.isAnonymous() && !this.isModified() && !this.isLatest()
  }

  isReadOnly() {
    return this.isSaved() && !!this.query.isReadOnly
  }

  name() {
    if (this.isAnonymous()) return ""
    return this.query.name
  }

  value() {
    return this.version?.value
  }

  ts() {
    return this.version?.ts
  }

  toZed() {
    return new EditorSnapshot(this.version).toQueryText()
  }
}
