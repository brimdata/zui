import {QueriesAction, QueriesState, Item} from "./types"
import produce from "immer"
import TreeModel from "tree-model"

const itemToNode = (item: Item): TreeModel.Node<Item> =>
  new TreeModel({childrenPropertyName: "items"}).parse(item)

const getNodeById = (
  root: TreeModel.Node<Item>,
  itemId: string
): TreeModel.Node<Item> => root.first((n) => n.model.id === itemId)

const init = () => ({
  id: "root",
  name: "root",
  isOpen: true,
  items: [],
})

const upsertItem = (parent: TreeModel.Node<Item>, item: Item) => {
  const newItemNode = itemToNode(item)
  const itemNode = parent?.first((n) => n.model.id === item.id)
  if (!itemNode) {
    parent?.addChild(newItemNode)
    return
  }

  // preserve order if replacing
  const ndx = itemNode.getIndex()
  itemNode?.drop()
  parent.addChildAtIndex(newItemNode, ndx)
}

export default produce((draft: QueriesState, action: QueriesAction) => {
  const queriesTree = itemToNode(draft)
  let node: TreeModel.Node<Item>
  switch (action.type) {
    case "$QUERIES_SET_ALL":
      return action.rootGroup
    case "$QUERIES_ADD_ITEM":
      node = getNodeById(queriesTree, action.parentGroupId)
      if (!("items" in node.model)) {
        console.error("items may only be added to groups")
        return
      }

      upsertItem(node, action.item)
      return queriesTree.model
    case "$QUERIES_REMOVE_ITEMS":
      action.itemIds.forEach((itemId) => {
        getNodeById(queriesTree, itemId)?.drop()
      })
      return queriesTree.model
    case "$QUERIES_EDIT_ITEM":
      Object.assign(getNodeById(queriesTree, action.itemId).model, action.item)
      return queriesTree.model
    case "$QUERIES_TOGGLE_GROUP":
      node = getNodeById(queriesTree, action.groupId)
      if (!("items" in node.model)) {
        console.error("cannot open/close queries, only groups")
        return
      }
      node.model.isOpen =
        action.value === undefined ? !node.model.isOpen : action.value
      return queriesTree.model
    case "$QUERIES_MOVE_ITEMS":
      moveItems(queriesTree, action)
      return queriesTree.model
  }
}, init())

const moveItems = (queriesTree, action) => {
  const parentNode = getNodeById(queriesTree, action.parentId)
  action.itemIds.forEach((itemId) => {
    const node = getNodeById(queriesTree, itemId)
    parentNode.addChildAtIndex(itemToNode(node.model), action.index)
    node?.drop()
  })
}
