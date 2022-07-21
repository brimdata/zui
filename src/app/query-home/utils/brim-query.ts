import {Query} from "src/js/state/Queries/types"
import {isEmpty, last} from "lodash"
import {QueryPin, QueryPinInterface} from "../../../js/state/Editor/types"
import {nanoid} from "@reduxjs/toolkit"
import {parseAst} from "@brimdata/zealot"
import buildPin from "src/js/state/Editor/models/build-pin"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import brim from "src/js/brim"

export class BrimQuery implements Query {
  id: string
  name: string
  description?: string
  tags?: string[]
  isReadOnly?: boolean
  current: QueryVersion
  currentVersionId: string
  versions: QueryVersion[]

  constructor(raw: Query, versions: QueryVersion[], current?: string) {
    this.id = raw.id
    this.name = raw.name
    this.versions = versions
    this.description = raw.description || ""
    this.tags = raw.tags || []
    this.isReadOnly = raw.isReadOnly || false
    this.currentVersionId = current
    // default current to latest version if none supplied
    this.current = current
      ? versions?.find((v) => v.version === current)
      : last(versions)
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

  newVersion(value?: string, pins?: QueryPin[]) {
    const newV: QueryVersion = {
      value: value ?? "",
      pins: pins ?? [],
      version: nanoid(),
      ts: new Date().toISOString(),
    }
    return new BrimQuery(this.serialize(), [...this.versions, newV])
  }

  getFromPin() {
    const from = this.ast().proc("From")
    if (!from) return null
    const trunk = from.trunks.find((t) => t.source.kind === "Pool")
    if (!trunk) return null
    const name = trunk.source.spec.pool
    if (!name) return null
    return name
  }

  latestVersion(): QueryVersion {
    return last(this.versions)
  }

  latestVersionId(): string {
    return this.latestVersion().version
  }

  getPoolName() {
    return this.getFromPin()
  }

  private ast() {
    let tree
    try {
      tree = parseAst(this.toString())
    } catch (error) {
      tree = {error}
    }
    return brim.ast(tree)
  }

  checkSyntax() {
    let error = null
    try {
      parseAst(this.toString())
    } catch (e) {
      error = e
    }
    return error
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
