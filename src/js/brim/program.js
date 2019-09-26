/* @flow */

import LookyTalk from "lookytalk"

import {trim} from "../lib/Str"
import brim, {type $Field, type $Log} from "./"
import stdlib from "../stdlib"

export default function(p: string = "") {
  return {
    exclude(field: $Field) {
      p = insertFilter(p, brim.syntax.exclude(field))
      return this
    },

    include(field: $Field) {
      p = insertFilter(p, brim.syntax.include(field))
      return this
    },

    drillDown(log: $Log) {
      let filter = this.filter()
      let newFilters = brim
        .ast(this.ast())
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
        tree = LookyTalk.parse(p)
      } catch (error) {
        tree = {error}
      }
      return brim.ast(tree)
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
