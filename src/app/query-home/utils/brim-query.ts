import {Query} from "src/js/state/Queries/types"
import {isEmpty, last} from "lodash"
import {QueryPinInterface} from "../../../js/state/Editor/types"
import {parseAst} from "@brimdata/zealot"
import buildPin from "src/js/state/Editor/models/build-pin"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {QuerySource} from "src/js/api/queries/types"

export class BrimQuery implements Query {
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

  get isLocal() {
    return this.source === "local"
  }

  get isRemote() {
    return this.source === "remote"
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

  static checkSyntax(version: QueryVersion) {
    const zed = this.versionToZed(version)
    let error = null
    try {
      parseAst(zed)
    } catch (e) {
      error = e
    }
    return error
  }

  static versionToZed(version: QueryVersion): string {
    let pinS = []
    if (!isEmpty(version?.pins))
      pinS = version.pins
        .filter((p) => !p.disabled)
        .map<QueryPinInterface>(buildPin)
        .map((p) => p.toZed())
    let s = pinS
      .concat(version?.value ?? "")
      .filter((s) => s.trim() !== "")
      .join(" | ")
      .trim()

    if (isEmpty(s)) s = "*"

    return s
  }

  toString(): string {
    return BrimQuery.versionToZed(this.current)
  }
}
