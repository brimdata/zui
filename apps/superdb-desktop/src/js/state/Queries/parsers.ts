import {Group} from "./types"
import {nanoid} from "@reduxjs/toolkit"
import {cloneDeep} from "lodash"
import {QueryPin} from "../Editor/types"
import file from "src/js/lib/file"

export type JSONQuery = {
  value: string
  pins: QueryPin[]
}

export type JSONGroup = {
  name: string
  items: (JSONGroup | JSONQuery)[]
}

export const parseJSONLib = (filePath: string): {libRoot: Group} => {
  const contents = file(filePath).readSync()
  const libRoot: Group = JSON.parse(contents)
  flattenItemTree(libRoot).forEach((item) => {
    item.id = nanoid()
    if ("items" in item) {
      item.isOpen = false
    } else {
      item.value ??= ""
      item.pins ??= []
    }
  })

  // The lib root is what gets added to queries
  return {libRoot}
}

export const serializeQueryLib = (group: Group): JSONGroup => {
  // remove internal keys
  const jsonGroup = cloneDeep(group)
  const flat = flattenItemTree(jsonGroup)
  flat.forEach((item) => {
    if ("items" in item) return
    delete item.id
    delete item.isOpen
  })

  return jsonGroup as JSONGroup
}

export const flattenItemTree = (root) => {
  const items = [root]
  for (let i = 0; i < items.length; i++) {
    const current = items[i]
    if (current.items && current.items.length > 0) items.push(...current.items)
  }

  return items
}
