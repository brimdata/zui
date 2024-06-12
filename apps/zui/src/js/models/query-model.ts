import {Query} from "src/js/state/Queries/types"
import {last} from "lodash"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {QuerySource} from "src/js/api/queries/types"

export class QueryModel implements Query {
  id: string
  name: string
  description?: string
  tags?: string[]
  isReadOnly?: boolean
  current: QueryVersion
  versions: QueryVersion[]
  source: QuerySource

  constructor(raw: Query, versions: QueryVersion[], source: QuerySource) {
    this.id = raw.id
    this.name = raw.name
    this.source = source
    this.versions = versions
    this.description = raw.description || ""
    this.tags = raw.tags || []
    this.isReadOnly = raw.isReadOnly || false
    this.current = last(versions)
  }

  get value() {
    return this.current?.value ?? ""
  }

  get pins() {
    return this.current?.pins ?? []
  }

  hasVersion(version: string): boolean {
    return !!this.versions?.map((v) => v.version).includes(version)
  }

  latestVersion(): QueryVersion {
    return last(this.versions) ?? null
  }

  latestVersionId() {
    if (this.latestVersion()) {
      return this.latestVersion().version
    } else {
      return null
    }
  }

  serialize(): Query {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      tags: this.tags,
      isReadOnly: this.isReadOnly,
    }
  }
}
