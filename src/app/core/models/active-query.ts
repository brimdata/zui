import {ZedAst} from "src/app/core/models/zed-ast"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import {QueryVersion} from "src/js/state/QueryVersions/types"

export class ActiveQuery {
  constructor(
    public session: BrimQuery, // the singleton for the tab
    public query: BrimQuery | null, // the query from the url param
    public version: QueryVersion // the version from the url param
  ) {}

  id() {
    return this.query?.id || this.session.id
  }

  versionId() {
    return this.version.version || null
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
      !this.isAnonymous() &&
      this.query.latestVersionId() === this.version.version
    )
  }

  isModified() {
    return !this.isAnonymous() && !this.query.hasVersion(this.version?.version)
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
    return this.version.value
  }

  ts() {
    return this.version.ts
  }

  toZed() {
    return BrimQuery.versionToZed(this.version)
  }

  toAst() {
    return new ZedAst(BrimQuery.versionToZed(this.version))
  }
}
