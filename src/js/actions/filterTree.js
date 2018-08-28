export const clearFilterTree = () => ({
  type: "FILTER_TREE_CLEAR"
})

export const removeFilterTreeNode = node => ({
  type: "FILTER_TREE_NODE_REMOVE",
  node
})
