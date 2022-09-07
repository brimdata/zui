import TreeModel from "tree-model"
import {Group, Query} from "./types"
import {isArray, isObject, last} from "lodash"

export const flattenQueryTree = (root: Group, includeFolders = true) => {
  return new TreeModel({childrenPropertyName: "items"}).parse(root).all((n) => {
    return n.model.id !== "root" && (includeFolders || !("items" in n))
  })
}

export const getNextCount = (
  queries: Query[],
  type: "Session" | "Query"
): number => {
  const regex = type === "Session" ? /^Session #\d+$/ : /^Query #\d+$/
  return (
    (last(
      queries
        .filter((q) => regex.test(q.name))
        .map((q) => parseInt(q.name.split("#")[1]))
        .sort((a, b) => a - b)
    ) ?? 0) + 1
  )
}

export const isQuery = (obj: unknown): obj is Query => {
  return isObject(obj) && "name" in obj && "id" in obj
}

export const isGroup = (obj: unknown): obj is Group => {
  if (
    isObject(obj) &&
    "name" in obj &&
    "id" in obj &&
    "items" in obj &&
    isArray(obj["items"])
  ) {
    return obj["items"].every((item) => isGroup(item) || isQuery(item))
  } else {
    return false
  }
}
