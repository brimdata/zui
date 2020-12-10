export type QueriesState = Group

export type Item = Query | Group

export interface Query {
  id: string
  name: string
  value: string
  description: string
  tags: string[]
}

export interface Group {
  id: string
  name: string
  items: (Group | Query)[]
}

export type QueriesAction =
  | QUERIES_SET_ALL
  | QUERIES_ADD_ITEM
  | QUERIES_REMOVE_ITEMS
  | QUERIES_EDIT_ITEM
  | QUERIES_MOVE_ITEMS

export interface QUERIES_SET_ALL {
  type: "QUERIES_SET_ALL"
  rootGroup: Group
}

export interface QUERIES_ADD_ITEM {
  type: "QUERIES_ADD_ITEM"
  item: Item
  parentGroup: Group
}

export interface QUERIES_REMOVE_ITEMS {
  type: "QUERIES_REMOVE_ITEMS"
  items: Item[]
}

export interface QUERIES_EDIT_ITEM {
  type: "QUERIES_EDIT_ITEM"
  item: Item
  itemId: string
}

export interface QUERIES_MOVE_ITEMS {
  type: "QUERIES_MOVE_ITEMS"
  items: Item[]
  parentGroup: Group
  index: number
}
