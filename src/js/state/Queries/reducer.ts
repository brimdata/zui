import {QueriesAction, QueriesState, Item} from "./types"
import produce, {original} from "immer"
import init from "ppl/queries/initial"
import TreeModel from "tree-model"
import {includes} from "lodash"

const itemToNode = (item: Item): TreeModel.Node<Item> =>
  new TreeModel({childrenPropertyName: "items"}).parse(item)

const getNodeById = (
  root: TreeModel.Node<Item>,
  itemId: string
): TreeModel.Node<Item> => root.first((n) => n.model.id === itemId)

export default produce((draft: QueriesState, action: QueriesAction) => {
  const queriesTree = itemToNode(draft)
  let node
  switch (action.type) {
    case "$QUERIES_SET_ALL":
      return action.rootGroup
    case "$QUERIES_ADD_ITEM":
      node = getNodeById(queriesTree, action.parentGroupId)
      if (!("isOpen" in node.model)) {
        console.error("items may only be added to groups")
        return
      }
      node.addChild(itemToNode(action.item))
      return queriesTree.model
    case "$QUERIES_REMOVE_ITEMS":
      action.itemIds.forEach((itemId) => {
        getNodeById(queriesTree, itemId).drop()
      })
      return queriesTree.model
    case "$QUERIES_EDIT_ITEM":
      Object.assign(getNodeById(queriesTree, action.itemId).model, action.item)
      return queriesTree.model
    case "$QUERIES_TOGGLE_GROUP":
      node = getNodeById(queriesTree, action.groupId)
      if (node.model.isOpen === undefined) {
        console.error("cannot open/close queries, only groups")
        return
      }
      node.model.isOpen = !node.model.isOpen
      return queriesTree.model
    case "$QUERIES_MOVE_ITEMS":
      moveItems(queriesTree, action)
      return queriesTree.model
  }
}, init())

const moveItems = (queriesTree, action) => {
  const parentNode = getNodeById(queriesTree, action.parentId)
  action.itemIds.reverse().forEach((itemId) => {
    const node = getNodeById(queriesTree, itemId)
    // If the move is all in the same directory then the adjusting indices can
    // cause an off-by-one/stale-index issue since the destination index will be affected after
    // removal (e.g. an item cannot be moved to the end of its current group because of this).
    // For this situation we instead remove the item first, and then insert its copy
    if (
      includes(
        original(parentNode.model).items.map((i) => i.id),
        itemId
      )
    ) {
      node.drop()
      parentNode.addChildAtIndex(itemToNode(node.model), action.index)
    } else {
      parentNode.addChildAtIndex(itemToNode(node.model), action.index)
      node.drop()
    }
  })
}
