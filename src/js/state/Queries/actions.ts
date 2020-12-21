import {
  Group,
  Item,
  QUERIES_ADD_ITEM,
  QUERIES_EDIT_ITEM,
  QUERIES_MOVE_ITEMS,
  QUERIES_REMOVE_ITEMS,
  QUERIES_SET_ALL
} from "./types"

export default {
  setAll: (rootGroup: Group): QUERIES_SET_ALL => ({
    type: "QUERIES_SET_ALL",
    rootGroup
  }),
  addItem: (item: Item, parentGroup: Group): QUERIES_ADD_ITEM => ({
    type: "QUERIES_ADD_ITEM",
    item,
    parentGroup
  }),
  removeItems: (items: Item[]): QUERIES_REMOVE_ITEMS => ({
    type: "QUERIES_REMOVE_ITEMS",
    items
  }),
  editItem: (item: Item, itemId: string): QUERIES_EDIT_ITEM => ({
    type: "QUERIES_EDIT_ITEM",
    item,
    itemId
  }),
  moveItems: (
    items: Item[],
    parentGroup: Group,
    index: number
  ): QUERIES_MOVE_ITEMS => ({
    type: "QUERIES_MOVE_ITEMS",
    items,
    parentGroup,
    index
  })
}
