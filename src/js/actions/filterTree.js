/* @flow */

import {Node} from "../models/Node"

export const clearFilterTree = () => ({
  type: "FILTER_TREE_CLEAR"
})

export const removeFilterTreeNode = (node: Node) => ({
  type: "FILTER_TREE_NODE_REMOVE",
  node
})
