import {parseAst, zed} from "@brimdata/zealot"
import {isEmpty} from "lodash"
import {trim} from "../lib/Str"
import stdlib from "../stdlib"
import brim from "./"
import {ANALYTIC_PROCS} from "./ast"

export default function (p = "", pins: string[] = []) {
  p = concatPins(p, pins)

  return {
    exclude(field: zed.Field) {
      p = insertFilter(p, brim.syntax.exclude(field))
      return this
    },

    include(field: zed.Field) {
      p = insertFilter(p, brim.syntax.include(field))
      return this
    },

    in(field: zed.Field, value: zed.Value) {
      p = insertFilter(p, brim.syntax.in(field, value))
      return this
    },

    notIn(field: zed.Field, value: zed.Value) {
      p = insertFilter(p, brim.syntax.notIn(field, value))
      return this
    },

    cut(...fields: string[]) {
      p = stdlib
        .string(p)
        .append(" | cut " + fields.join(", "))
        .self()
      return this
    },

    drillDown(log: zed.Record) {
      let filter = this.filter()

      const newFilters = this.ast()
        .groupByKeys()
        .map((name) => log.tryField(name))
        .filter((f) => !!f)
        .map(brim.syntax.include)
        .join(" ")

      if (/\s*\*\s*/.test(filter)) filter = ""
      if (newFilters.includes(filter)) filter = ""

      p = stdlib.string(filter).append(" ").append(newFilters).trim().self()

      return this
    },

    countBy(field: zed.Field) {
      p = stdlib
        .string(p)
        .append(" | " + brim.syntax.countBy(field))
        .trim()
        .self()

      return this
    },

    sortBy(name: string | string[], direction: "asc" | "desc" = "asc") {
      p = stdlib
        .string(p)
        .replace(/\|\s*sort[^|]*$/i, "")
        .append(" | " + brim.syntax.sortBy(name, direction))
        .trim()
        .self()

      return this
    },

    ast() {
      let tree
      try {
        tree = parseAst(p)
      } catch (error) {
        tree = {error}
      }
      return brim.ast(tree)
    },

    filter() {
      const [head, ...tail] = p.split(
        /\|?\s*(summarize|count|countdistinct|sum)/i
      )

      if (isEmpty(tail) && this.hasAnalytics()) {
        return "*"
      } else {
        if (isEmpty(trim(head))) return "*"
        return trim(head)
      }
    },

    procs() {
      const [_, ...procs] = p.split("|")
      return procs.join("|")
    },

    string() {
      return p.trim() === "" ? "*" : p
    },

    hasAnalytics() {
      for (const proc of this.ast().getProcs()) {
        if (ANALYTIC_PROCS.includes(proc.kind)) return true
      }
      return false
    },
  }
}

function insertFilter(program, filter) {
  return stdlib
    .string(program)
    .insert(" " + filter + " ", filterEnd(program))
    .trim()
    .self()
}

function filterEnd(string) {
  const pos = string.indexOf("|")
  if (pos < 0) {
    return string.length
  } else {
    return pos
  }
}

function concatPins(program, pins) {
  return [...pins, program].map((s) => trim(s)).join(" ")
}
