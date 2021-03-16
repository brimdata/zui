import {isEqual} from "lodash"
import ZQL from "zq/zql/zql.js"

import {EVERYTHING_FILTER, FILTER_PROC, TUPLE_PROCS} from "./ast"
import {trim} from "../lib/Str"
import brim from "./"
import stdlib from "../stdlib"
import {zng} from "zealot"
import {Cell, createCell} from "./cell"

export default function(p = "", pins: string[] = []) {
  p = concatPins(p, pins)

  return {
    exclude(field: Cell) {
      p = insertFilter(p, brim.syntax.exclude(field))
      return this
    },

    include(field: Cell) {
      p = insertFilter(p, brim.syntax.include(field))
      return this
    },

    in(field: Cell) {
      p = insertFilter(p, brim.syntax.in(field))
      return this
    },

    notIn(field: Cell) {
      p = insertFilter(p, brim.syntax.notIn(field))
      return this
    },

    cut(...fields: string[]) {
      p = stdlib
        .string(p)
        .append(" | cut " + fields.join(", "))
        .self()
      return this
    },

    drillDown(log: zng.Record) {
      let filter = this.filter()
      const newFilters = this.ast()
        .groupByKeys()
        .map((n) => log.tryField(n))
        .filter((f) => !!f)
        .map(createCell)
        .map(brim.syntax.include)
        .join(" ")

      if (/\s*\*\s*/.test(filter)) filter = ""
      if (newFilters.includes(filter)) filter = ""

      p = stdlib
        .string(filter)
        .append(" ")
        .append(newFilters)
        .trim()
        .self()

      return this
    },

    countBy(field: Cell) {
      p = stdlib
        .string(p)
        .append(" | " + brim.syntax.countBy(field))
        .trim()
        .self()

      return this
    },

    sortBy(name: string, direction: "asc" | "desc" = "asc") {
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
        tree = ZQL.parse(p)
      } catch (error) {
        tree = {error}
      }
      return brim.ast(tree)
    },

    filter() {
      const proc = this.ast().proc(FILTER_PROC)
      if (
        proc === undefined ||
        (proc && isEqual(proc.filter, EVERYTHING_FILTER))
      ) {
        return "*"
      } else {
        const [f] = p.split("|")
        return trim(f)
      }
    },

    procs() {
      const [_, ...procs] = p.split("|")
      return procs.join("|")
    },

    string() {
      return p
    },

    hasAnalytics() {
      for (const proc of this.ast().getProcs()) {
        if (!TUPLE_PROCS.includes(proc.kind)) return true
      }
      return false
    }
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
