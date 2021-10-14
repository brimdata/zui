import {Group} from "./types"
import lib from "../../lib"
import {nanoid} from "@reduxjs/toolkit"

export const parseJSONLib = (file: File): Group => {
  const contents = lib.file(file.path).readSync()
  const itemTreeRoot = JSON.parse(contents)

  // annotate each item (in place) with an internal reference 'id'
  flattenItemTree(itemTreeRoot).forEach((item) => (item.id = nanoid()))

  return itemTreeRoot as Group
}

const flattenItemTree = (root) => {
  const items = [root]
  for (let i = 0; i < items.length; i++) {
    const current = items[i]
    if (current.items && current.items.length > 0) items.push(...current.items)
  }

  return items
}
