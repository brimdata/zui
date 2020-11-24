import {
  Group,
  QLIB_ADD_ITEM,
  QLIB_EDIT_ITEM,
  QLIB_MOVE_ITEM,
  QLIB_REMOVE_ITEM,
  QLIB_SET_ALL,
  Query
} from "./types"

export default {
  setAll: (rootGroup: Group): QLIB_SET_ALL => ({
    type: "QLIB_SET_ALL",
    rootGroup
  }),
  addItem: (item: Query | Group, groupPath: number[]): QLIB_ADD_ITEM => ({
    type: "QLIB_ADD_ITEM",
    item,
    groupPath
  }),
  removeItem: (itemPath: number[]): QLIB_REMOVE_ITEM => ({
    type: "QLIB_REMOVE_ITEM",
    itemPath
  }),
  editItem: (item: Query | Group, itemPath: number[]): QLIB_EDIT_ITEM => ({
    type: "QLIB_EDIT_ITEM",
    item,
    itemPath
  }),
  moveItem: (
    srcItemPath: number[],
    destItemPath: number[]
  ): QLIB_MOVE_ITEM => ({
    type: "QLIB_MOVE_ITEM",
    srcItemPath,
    destItemPath
  })
}
