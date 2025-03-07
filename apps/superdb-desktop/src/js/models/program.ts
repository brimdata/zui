import * as zed from "../../../../../packages/superdb-types/dist"
import {isEmpty, last} from "lodash"
import {trim} from "../lib/Str"
import syntax from "./syntax"

export default function program(p = "") {
  return {
    exclude(field: zed.Field) {
      p = appendWithPipe(p, syntax.exclude(field))
      return this
    },

    include(field: zed.Field) {
      p = appendWithPipe(p, syntax.include(field))
      return this
    },

    in(field: zed.Field, value: zed.Value) {
      p = appendWithPipe(p, syntax.in(field, value))
      return this
    },

    notIn(field: zed.Field, value: zed.Any) {
      p = appendWithPipe(p, syntax.notIn(field, value))
      return this
    },

    cut(...fields: string[]) {
      p = appendWithPipe(p, "cut " + fields.join(", "))
      return this
    },

    quietCut(...fields: string[]) {
      return this.cut(fields.map((fieldName) => "quiet(" + fieldName + ")"))
    },

    countBy(name: string | string[]) {
      p = appendWithPipe(p, syntax.countBy(name))
      return this
    },

    sortBy(name: string | string[], direction: "asc" | "desc" = "asc") {
      p = p.replace(/\|\s*sort[^|]*$/i, "")
      p = appendWithPipe(p, syntax.sortBy(name, direction))
      return this
    },

    procs() {
      const [_, ...procs] = p.split("|")
      return procs.join("|")
    },

    string() {
      return p.trim() === "" ? "*" : p
    },
  }
}

export function getFilter(string: string, isSummarized: boolean) {
  const [head, ...tail] = string.split(
    /\|?\s*(summarize|count|countdistinct|sum)/i
  )
  if (isEmpty(tail) && isSummarized) {
    return "*"
  } else {
    if (isEmpty(trim(head))) return "*"
    return trim(head)
  }
}

export function drillDown(
  script: string,
  value: zed.Record,
  isSummarized: boolean,
  groupByKeys: string[]
) {
  let filter = getFilter(script, isSummarized)

  const newFilters = groupByKeys
    .map((name) => value.tryField(name))
    .filter((f) => !!f)
    .map(syntax.include)
    .join(" ")

  if (/^\s*\*\s*$/.test(filter)) filter = ""
  if (newFilters.includes(filter)) filter = ""

  script = appendWithPipe(filter, newFilters)
  return script
}

function appendWithPipe(program, filter) {
  if (isEmpty(program)) return filter
  if (!isWhitespace(last(program))) program += " "
  return program + "| " + filter
}

function isWhitespace(s: string) {
  return /\s/.test(s)
}

export function concatPins(program: string, pins: string[]) {
  return [...pins, program].map((s) => trim(s)).join(" ")
}
