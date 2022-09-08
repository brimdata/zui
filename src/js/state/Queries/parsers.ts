import {Group} from "./types"
import lib from "../../lib"
import {nanoid} from "@reduxjs/toolkit"
import {cloneDeep, last} from "lodash"
import {QueryVersion, QueryVersionsState} from "../QueryVersions/types"
import {QueryPin} from "../Editor/types"

export type JSONQuery = {
  value: string
  pins: QueryPin[]
}

export type JSONGroup = {
  name: string
  items: (JSONGroup | JSONQuery)[]
}

export const parseJSONLib = (
  filePath: string
): {libRoot: Group; versions: {[queryId: string]: QueryVersion}} => {
  const contents = lib.file(filePath).readSync()
  const libRoot: Group = JSON.parse(contents)
  const versions = {}
  flattenItemTree(libRoot).forEach((item) => {
    item.id = nanoid()
    if ("items" in item) {
      item.isOpen = false
    } else {
      versions[item.id] = {
        version: nanoid(),
        ts: new Date().toISOString(),
        value: item.value || "",
        pins: [...(item.pins ?? [])],
      } as QueryVersion
      delete item.value
      delete item.pins
    }
  })

  // The lib root is what gets added to queries
  // The versions is an object keyed by the query id
  // and the value is a single version to create
  return {libRoot, versions}
}

export const serializeQueryLib = (
  group: Group,
  versions: QueryVersionsState
): JSONGroup => {
  // remove internal keys
  const jsonGroup = cloneDeep(group)
  flattenItemTree(jsonGroup).forEach((item) => {
    const queryVs = versions[item.id]
    const {value, pins} = queryVs.entities[last(queryVs.ids)]
    item.value = value
    item.pins = pins
    delete item.id
    delete item.isOpen
  })

  return jsonGroup as JSONGroup
}

const flattenItemTree = (root) => {
  const items = [root]
  for (let i = 0; i < items.length; i++) {
    const current = items[i]
    if (current.items && current.items.length > 0) items.push(...current.items)
  }

  return items
}
