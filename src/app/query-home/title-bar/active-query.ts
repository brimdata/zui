import {QueryVersion} from "src/js/state/QueryVersions/types"
import {BrimQuery} from "../utils/brim-query"

export class ActiveQuery {
  constructor(
    public session: BrimQuery, // the singleton for the tab
    public query: BrimQuery | null, // the query from the url param
    public version: QueryVersion | null // the version from the url param
  ) {}

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

  name() {
    if (this.isAnonymous()) return ""
    return this.query.name
  }

  value() {
    return this.version.value
  }
}
