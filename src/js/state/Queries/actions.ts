import {
  Group,
  QUERIES_ADD_ITEM,
  QUERIES_EDIT_ITEM,
  QUERIES_MOVE_ITEM,
  QUERIES_REMOVE_ITEM,
  QUERIES_SET_ALL,
  Query
} from "./types"

export default {
  setAll: (rootGroup: Group): QUERIES_SET_ALL => ({
    type: "QUERIES_SET_ALL",
    rootGroup
  }),
  addItem: (item: Query | Group, groupPath: number[]): QUERIES_ADD_ITEM => ({
    type: "QUERIES_ADD_ITEM",
    item,
    groupPath
  }),
  removeItem: (itemPath: number[]): QUERIES_REMOVE_ITEM => ({
    type: "QUERIES_REMOVE_ITEM",
    itemPath
  }),
  editItem: (item: Query | Group, itemPath: number[]): QUERIES_EDIT_ITEM => ({
    type: "QUERIES_EDIT_ITEM",
    item,
    itemPath
  }),
  moveItem: (
    srcItemPath: number[],
    destItemPath: number[]
  ): QUERIES_MOVE_ITEM => ({
    type: "QUERIES_MOVE_ITEM",
    srcItemPath,
    destItemPath
  })
}
