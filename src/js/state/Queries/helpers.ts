import TreeModel from "tree-model"
import {Group, Query} from "./types"
import {last} from "lodash"

export const flattenQueryTree = (root: Group, includeFolders = true) => {
  return new TreeModel({childrenPropertyName: "items"}).parse(root).all((n) => {
    return n.model.id !== "root" && (includeFolders || !("items" in n))
  })
}

export const getNextQueryCount = (queries: Query[]): number => {
  return (
    (last(
      queries
        .filter((q) => /^Query #\d+$/.test(q.name))
        .map((q) => parseInt(q.name.split("#")[1]))
        .sort((a, b) => a - b)
    ) ?? 0) + 1
  )
}
