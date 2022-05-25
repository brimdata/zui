import {Query} from "src/js/state/Queries/types"
import {ANALYTIC_PROCS, HEAD_PROC} from "src/js/brim/ast"
import {QueryVersion, VersionsState} from "src/js/state/QueryVersions"
import {last} from "lodash"
import {QueryPinInterface} from "../../../js/state/Editor/types"
import {isNumber} from "lodash"
import brim from "src/js/brim"
import {parseAst} from "@brimdata/zealot"
import buildPin from "src/js/state/Editor/models/build-pin"
export type PinType = "from" | "filter"
export const DRAFT_QUERY_NAME = "Draft Query"

export class BrimQuery implements Query {
  id: string
  name: string
  description?: string
  tags?: string[]
  isReadOnly?: boolean
  current: string | number
  versions: VersionsState
  head?: number

  constructor(raw: Query, versions: VersionsState, current?: string) {
    this.id = raw.id
    this.name = raw.name
    this.versions = versions
    this.description = raw.description || ""
    this.tags = raw.tags || []
    this.isReadOnly = raw.isReadOnly || false
    // default current to latest version if none supplied
    this.current = current ?? last(versions.ids)
  }

  get value() {
    return this.currentVersion().value
  }
  get pins() {
    return this.currentVersion().pins
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

  currentVersion(): QueryVersion {
    return this.versions.entities[this.current]
  }

  allVersions(): QueryVersion[] {
    return this.versions.ids.map((id) => this.versions.entities[id])
  }

  latestVersion(): QueryVersion {
    return this.versions.entities[last(this.versions.ids)]
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

  hasAnalytics() {
    for (const proc of this.ast().getProcs()) {
      if (ANALYTIC_PROCS.includes(proc.kind)) return true
    }
    return false
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

  toString(): string {
    const current = this.currentVersion()
    let s = current.pins
      .filter((p) => !p.disabled)
      .map<QueryPinInterface>(buildPin)
      .map((p) => p.toZed())
      .concat(current.value)
      .filter((s) => s.trim() !== "")
      .join(" | ")
      .trim()

    if (s === "") s = "*"
    if (isNumber(this.head)) s += ` | head ${this.head}`

    return s
  }
}
