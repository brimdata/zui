import {
  Group,
  Item,
  QUERIES_ADD_ITEM,
  QUERIES_EDIT_ITEM,
  QUERIES_MOVE_ITEMS,
  QUERIES_REMOVE_ITEMS,
  QUERIES_SET_ALL,
  QUERIES_TOGGLE_GROUP,
} from "./types"

export default {
  setAll: (rootGroup: Group): QUERIES_SET_ALL => ({
    type: "$QUERIES_SET_ALL",
    rootGroup,
  }),
  addItem: (item: Item, parentGroupId = "root"): QUERIES_ADD_ITEM => ({
    type: "$QUERIES_ADD_ITEM",
    item,
    parentGroupId,
  }),
  removeItems: (itemIds: string[]): QUERIES_REMOVE_ITEMS => ({
    type: "$QUERIES_REMOVE_ITEMS",
    itemIds,
  }),
  editItem: (item: Partial<Item>, itemId: string): QUERIES_EDIT_ITEM => ({
    type: "$QUERIES_EDIT_ITEM",
    item,
    itemId,
  }),
  moveItems: (
    itemIds: string[],
    parentId: string,
    index: number
  ): QUERIES_MOVE_ITEMS => ({
    type: "$QUERIES_MOVE_ITEMS",
    itemIds,
    parentId,
    index,
  }),
  toggleGroup: (groupId: string, value?: boolean): QUERIES_TOGGLE_GROUP => ({
    type: "$QUERIES_TOGGLE_GROUP",
    groupId,
    value,
  }),
}
