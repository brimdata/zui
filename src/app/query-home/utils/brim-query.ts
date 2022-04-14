import {Query} from "src/js/state/Queries/types"
import {set} from "lodash"
import brim from "src/js/brim"
import {ANALYTIC_PROCS, HEAD_PROC} from "src/js/brim/ast"
import {parseAst} from "@brimdata/zealot"
import {trim} from "src/js/lib/Str"
export type PinType = "from" | "filter"
export const DRAFT_QUERY_NAME = "Draft Query"

export class BrimQuery {
  private q: Query
  constructor(raw: Query) {
    this.q = {
      ...raw,
      pins: {
        from: raw.pins?.from || "",
        filters: []
      }
    }

    if (raw.pins?.filters) this.q.pins.filters.push(...raw.pins.filters)
  }

  setFromPin(value: string) {
    set(this.q, ["pins", "from"], value)
  }
  getFromPin(): string {
    return this.q.pins?.from
  }

  getFilterPins(): string[] {
    return this.q.pins?.filters
  }
  updateFilterPinByNdx(index: number, value: string) {
    if (!this.q.pins?.filters[index])
      return console.error(`filter pin at index '${index}' not found`)
    set(this.q, ["pins", "filters", index], value)
  }
  removeFilterPinByNdx(index: number) {
    this.q.pins?.filters?.splice(index, 1)
  }
  addFilterPin(value: string) {
    if (!this.q.pins?.filters) set(this.q, ["pins", "filters"], [value])
    else this.q.pins.filters.push(value)
  }

  hasHeadFilter() {
    return !!this.ast().proc(HEAD_PROC)
  }

  get isReadOnly() {
    return this.q.isReadOnly
  }
  toggleLock() {
    this.q.isReadOnly = !this.q.isReadOnly
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
    return {...this.q}
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
    return this.q.value
  }
  set value(val: string) {
    this.q.value = val
  }

  get id() {
    return this.q.id
  }

  get name() {
    return this.q.name
  }
  set name(n: string) {
    this.q.name = n
  }
}
