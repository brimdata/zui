export type QueriesState = Group

export interface Query {
  id: string
  name: string
  zql: string
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
  | QUERIES_REMOVE_ITEM
  | QUERIES_EDIT_ITEM
  | QUERIES_MOVE_ITEM

export interface QUERIES_SET_ALL {
  type: "QUERIES_SET_ALL"
  rootGroup: Group
}

export interface QUERIES_ADD_ITEM {
  type: "QUERIES_ADD_ITEM"
  item: Query | Group
  groupPath: number[]
}

export interface QUERIES_REMOVE_ITEM {
  type: "QUERIES_REMOVE_ITEM"
  itemPath: number[]
}

export interface QUERIES_EDIT_ITEM {
  type: "QUERIES_EDIT_ITEM"
  item: Query | Group
  itemPath: number[]
}

export interface QUERIES_MOVE_ITEM {
  type: "QUERIES_MOVE_ITEM"
  srcItemPath: number[]
  destItemPath: number[]
}
