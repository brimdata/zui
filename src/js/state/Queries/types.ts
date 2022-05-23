import {QueryPin} from "../Editor/types"

export type QueriesState = Group
export type Item = Query | Group

export interface Query {
  id: string
  name: string
  value: string
  pins?: QueryPin[]
  description?: string
  tags?: string[]
  isReadOnly?: boolean
}

export interface Group {
  id: string
  name: string
  items: (Group | Query)[]
  isOpen?: boolean
  isReadOnly?: boolean
}

export type QueriesAction =
  | QUERIES_SET_ALL
  | QUERIES_ADD_ITEM
  | QUERIES_REMOVE_ITEMS
  | QUERIES_EDIT_ITEM
  | QUERIES_MOVE_ITEMS
  | QUERIES_TOGGLE_GROUP

export interface QUERIES_SET_ALL {
  type: "$QUERIES_SET_ALL"
  rootGroup: Group
}

export interface QUERIES_ADD_ITEM {
  type: "$QUERIES_ADD_ITEM"
  item: Item
  parentGroupId: string
}

export interface QUERIES_REMOVE_ITEMS {
  type: "$QUERIES_REMOVE_ITEMS"
  itemIds: string[]
}

export interface QUERIES_EDIT_ITEM {
  type: "$QUERIES_EDIT_ITEM"
  item: Partial<Item>
  itemId: string
}

export interface QUERIES_MOVE_ITEMS {
  type: "$QUERIES_MOVE_ITEMS"
  itemIds: string[]
  parentId: string
  index: number
}

export interface QUERIES_TOGGLE_GROUP {
  type: "$QUERIES_TOGGLE_GROUP"
  groupId: string
  value?: boolean
}
