import {Query} from "src/js/state/Queries/types"
import brim from "src/js/brim"
import {ANALYTIC_PROCS, HEAD_PROC} from "src/js/brim/ast"
import {parseAst} from "@brimdata/zealot"
import {trim} from "src/js/lib/Str"
import {QueryVersion, VersionsState} from "src/js/state/QueryVersions"
import {last} from "lodash"
export type PinType = "from" | "filter"
export const DRAFT_QUERY_NAME = "Draft Query"

export class BrimQuery {
  readonly head: string | number
  constructor(
    readonly query: Query,
    readonly versions: VersionsState,
    head?: string
  ) {
    // default head to latest version if none supplied
    if (!head) this.head = versions.ids[versions.ids.length - 1]
    else this.head = head
  }

  currentVersion(): QueryVersion {
    return this.versions.entities[this.head]
  }

  allVersions(): QueryVersion[] {
    return this.versions.ids.map((id) => this.versions.entities[id])
  }

  latestVersion(): QueryVersion {
    return this.versions.entities[last(this.versions.ids)]
  }

  getFromPin(): string {
    return this.currentVersion()?.pins?.from || ""
  }

  getFilterPins(): string[] {
    return this.currentVersion()?.pins?.filters || []
  }

  hasHeadFilter() {
    return !!this.ast().proc(HEAD_PROC)
  }

  get isReadOnly() {
    return !!this.query.isReadOnly
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

  hasAnalytics() {
    for (const proc of this.ast().getProcs()) {
      if (ANALYTIC_PROCS.includes(proc.kind)) return true
    }
    return false
  }

  serialize(): Query {
    return {...this.query}
  }

  toString(): string {
    return [trim(this.value) || "*", ...this.getFilterPins()].join(" ")
  }

  format(): string {
    let formatted = this.toString()
    // if query already starts with 'from', we do not annotate it further (even if fromPin exists)
    // in the future we should instead do this by inspecting the ast
    if (/^from[\s(]/i.test(this.value)) return formatted
    const poolId = this.getFromPin()
    if (poolId) formatted = [`from '${poolId}'`, formatted].join(" | ")

    return formatted
  }

  get value() {
    return this.currentVersion()?.value || ""
  }

  get id() {
    return this.query.id
  }

  get name() {
    return this.query.name
  }
}
