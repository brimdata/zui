import {Group} from "./types"
import lib from "../../lib"
import {nanoid} from "@reduxjs/toolkit"
import {cloneDeep} from "lodash"

export const parseJSONLib = (filePath: string): Group => {
  const contents = lib.file(filePath).readSync()
  const itemTreeRoot = JSON.parse(contents)

  // annotate each item (in place) with an internal reference 'id' and defaults
  flattenItemTree(itemTreeRoot).forEach((item) => {
    item.id = nanoid()
    if ("items" in item) item.isOpen = false
  })

  return itemTreeRoot as Group
}

export const serializeQueryLib = (group: Group) => {
  // remove internal keys
  const jsonGroup = cloneDeep(group)
  flattenItemTree(jsonGroup).forEach((item) => {
    delete item.id
    delete item.isOpen
  })

  return jsonGroup
}

const flattenItemTree = (root) => {
  const items = [root]
  for (let i = 0; i < items.length; i++) {
    const current = items[i]
    if (current.items && current.items.length > 0) items.push(...current.items)
  }

  return items
}
