/* @flow */

import {isEqual} from "lodash"
import ZQL from "zq/zql/zql.js"

import {EVERYTHING_FILTER, FILTER_PROC, TUPLE_PROCS} from "./ast"
import {trim} from "../lib/Str"
import brim, {type $Field, type $Log} from "./"
import stdlib from "../stdlib"

export default function(p: string = "", pins: string[] = []) {
  p = concatPins(p, pins)

  return {
    exclude(field: $Field) {
      p = insertFilter(p, brim.syntax.exclude(field))
      return this
    },

    include(field: $Field) {
      p = insertFilter(p, brim.syntax.include(field))
      return this
    },

    in(field: $Field) {
      p = insertFilter(p, brim.syntax.in(field))
      return this
    },

    notIn(field: $Field) {
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

    drillDown(log: $Log) {
      let filter = this.filter()
      let newFilters = this.ast()
        .groupByKeys()
        .map((n) => log.field(n))
        .filter((f) => !!f)
        // $FlowFixMe flow doesn't know I just took out all the nils
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

    countBy(field: $Field) {
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
      let proc = this.ast().proc(FILTER_PROC)
      if (proc && isEqual(proc.filter, EVERYTHING_FILTER)) {
        return "*"
      } else {
        let [f] = p.split("|")
        return trim(f)
      }
    },

    procs() {
      let [_, ...procs] = p.split("|")
      return procs.join("|")
    },

    string() {
      return p
    },

    hasAnalytics() {
      for (let proc of this.ast().getProcs()) {
        if (!TUPLE_PROCS.includes(proc.op)) return true
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
  let pos = string.indexOf("|")
  if (pos < 0) {
    return string.length
  } else {
    return pos
  }
}

function concatPins(program, pins) {
  return [...pins, program].map((s) => trim(s)).join(" ")
}
