/* @flow */

import isEqual from "lodash/isEqual"
import type {ScrollPosition} from "../types"

type Args = {
  position: number,
  entries: *[]
}

export default function({entries: initEntries, position}: Args) {
  let entries = [...initEntries]

  if (position < -1 || position >= entries.length) {
    throw new Error("Position out of bounds")
  }

  return {
    push(entry: *) {
      if (!isEqual(entry, this.getCurrentEntry())) {
        entries.splice(position + 1, entries.length, entry)
        position = entries.length - 1
      }
      return this
    },
    update(scrollPos: ScrollPosition) {
      this.getCurrentEntry().scrollPos = scrollPos
      return this
    },
    goBack() {
      if (this.canGoBack()) position -= 1
      return this
    },
    goForward() {
      if (this.canGoForward()) position += 1
      return this
    },
    canGoBack() {
      return entries.length > 1 ? position !== 0 : false
    },
    canGoForward() {
      return entries.length > 1 ? position < entries.length - 1 : false
    },
    getEntries() {
      return entries
    },
    getCurrentEntry() {
      return entries[position]
    },
    data() {
      return {position, entries}
    }
  }
}
