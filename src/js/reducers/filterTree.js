import createReducer from "./createReducer"
import Tree from "../models/Tree"
import isEqual from "lodash/isEqual"

export const initialState = new Tree({data: "ROOT"}).toJSON()

export default createReducer(initialState, {
  SEARCH_HISTORY_PUSH: (state, {entry}) =>
    insertAppliedFilters(state, entry.searchBar),

  FILTER_TREE_CLEAR: () => initialState,

  FILTER_TREE_NODE_REMOVE: (state, {node}) => {
    const tree = new Tree(state)
    const treeNode = tree.getNodeAt(node.getIndexPath())
    tree.remove(treeNode)
    return tree.toJSON()
  }
})

export function insertAppliedFilters(treeData, searchBar) {
  let tree = new Tree(treeData)
  let node = tree.getRoot()

  combine(searchBar).forEach(filter => {
    let nextNode = node.children.find(child => isEqual(child.data, filter))
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

export const getFilterTree = state => state.filterTree
