import {Query} from "src/js/state/Queries/types"
import {isNumber} from "lodash"
import brim from "src/js/brim"
import {ANALYTIC_PROCS, HEAD_PROC} from "src/js/brim/ast"
import {parseAst} from "@brimdata/zealot"
import buildPin from "src/js/state/Editor/models/build-pin"
import {QueryPin} from "src/js/state/Editor/types"
export type PinType = "from" | "filter"
export const DRAFT_QUERY_NAME = "Draft Query"

export class BrimQuery implements Query {
  id: string
  name: string
  value: string
  pins?: QueryPin[]
  description?: string
  tags?: string[]
  isReadOnly?: boolean
  head?: number

  constructor(raw: Query) {
    this.id = raw.id
    this.name = raw.name
    this.value = raw.value
    this.pins = raw.pins || []
    this.description = raw.description || ""
    this.tags = raw.tags || []
    this.isReadOnly = raw.isReadOnly || false
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

  getPoolName() {
    return this.getFromPin()
  }

  hasHeadFilter() {
    return !!this.ast().proc(HEAD_PROC)
  }

  toggleLock() {
    this.isReadOnly = !this.isReadOnly
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
      value: this.value,
      pins: this.pins,
      description: this.description,
      tags: this.tags,
      isReadOnly: this.isReadOnly,
    }
  }

  toString(): string {
    let s = this.pins
      .filter((p) => !p.disabled)
      .map(buildPin)
      .map((p) => p.toZed())
      .concat(this.value)
      .filter((s) => s.trim() !== "")
      .join(" | ")
      .trim()

    if (s === "") s = "*"
    if (isNumber(this.head)) s += ` | head ${this.head}`

    return s
  }
}
