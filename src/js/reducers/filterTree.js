/* @flow */

import isEqual from "lodash/isEqual"

import type {SearchRecord} from "../types"
import type {State} from "./types"
import Tree, {type NodeAttrs} from "../models/Tree"
import createReducer from "./createReducer"

export const initialState = new Tree({
  data: "ROOT",
  children: [],
  parent: null
}).toJSON()

export type FilterTree = {data: *, children: *[]}

export default createReducer(initialState, {
  SEARCH_HISTORY_PUSH: (state, {entry}) => insertAppliedFilters(state, entry),

  FILTER_TREE_CLEAR: () => ({...initialState}),

  FILTER_TREE_NODE_REMOVE: (state, {node}) => {
    const tree = new Tree(state)
    const treeNode = tree.getNodeAt(node.getIndexPath())
    if (treeNode) tree.remove(treeNode)
    return tree.toJSON()
  }
})

export function insertAppliedFilters(
  treeData: NodeAttrs,
  record: $Shape<SearchRecord>
) {
  let tree = new Tree(treeData)
  let node = tree.getRoot()

  combine(record).forEach((filter) => {
    if (!node) return
    let nextNode = node.children.find((child) => isEqual(child.data, filter))
    if (nextNode) {
      node = nextNode
    } else {
      node = node.addChild(filter)
    }
  })

  return tree.toJSON()
}

function combine(searchBar) {
  const {pins, program} = searchBar
  const filters = [...pins]

  if (!/^\s*$/.test(program)) filters.push(program)
  return filters
}

export const getFilterTree = (state: State) => {
  return state.filterTree
}
