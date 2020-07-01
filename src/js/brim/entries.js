/* @flow */

import isEqual from "lodash/isEqual"

type Args = {
  position: number,
  entries: *[],
  scrollPositions: *[]
}

export default function({
  entries: initEntries,
  position,
  scrollPositions: initScrollPositions = []
}: Args) {
  let entries = [...initEntries]
  let scrollPositions = [...initScrollPositions]

  if (position < -1 || position >= entries.length) {
    throw new Error("Position out of bounds")
  }

  return {
    push(entry: *, scrollPos: *) {
      if (!isEqual(entry, this.getCurrentEntry())) {
        entries.splice(position + 1, entries.length, entry)
        scrollPositions.splice(position + 1, scrollPositions.length, scrollPos)
        position = entries.length - 1
      }
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
      return {position, entries, scrollPositions}
    }
  }
}
