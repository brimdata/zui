/* @flow */

import LookyTalk from "lookytalk"

import {onlyWhitespace, trim} from "../lib/Str"
import brim, {type $Field, type $Log} from "./"
import stdlib from "../stdlib"

export default function(p: string = "") {
  return {
    exclude(field: $Field) {
      p = insertFilter(p, field.excludeFilter())
      return this
    },

    include(field: $Field) {
      p = insertFilter(p, field.includeFilter())
      return this
    },

    drillDown(log: $Log) {
      let filter = this.filter()
      let newFilters = brim
        .ast(this.ast())
        .groupByKeys()
        .map((n) => log.field(n))
        .filter((f) => !!f)
        .map((f) => f && f.includeFilter())
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
      let current = onlyWhitespace(p) ? "*" : p
      p = trim(current + ` | count() by ${field.name}`)
      return this
    },

    ast() {
      return LookyTalk.parse(p)
    },

    filter() {
      let [f] = p.split("|")
      return trim(f)
    },

    procs() {
      let [_, ...procs] = p.split("|")
      return procs.join("|")
    },

    string() {
      return p
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
