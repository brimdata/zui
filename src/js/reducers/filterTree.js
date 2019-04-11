/* @flow */

import createReducer from "./createReducer"
import Tree from "../models/Tree"
import isEqual from "lodash/isEqual"
import type {State} from "./types"
import type {NodeAttrs} from "../models/Tree"
import type {SearchBar} from "./searchBar"

export const initialState = new Tree({
  data: "ROOT",
  children: [],
  parent: null
}).toJSON()

export type FilterTree = {data: *, children: *[]}

export default createReducer(initialState, {
  SEARCH_HISTORY_PUSH: (state, {entry}) =>
    insertAppliedFilters(state, entry.searchBar),

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
  searchBar: $Shape<SearchBar>
) {
  let tree = new Tree(treeData)
  let node = tree.getRoot()

  combine(searchBar).forEach((filter) => {
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
  const {pinned, current} = searchBar
  const filters = [...pinned]

  if (!/^\s*$/.test(current)) filters.push(current)
  return filters
}

export const getFilterTree = (state: State) => {
  return state.filterTree
}
