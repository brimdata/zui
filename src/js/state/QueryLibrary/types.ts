export type QueryLibraryState = Group

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

export type QueryLibraryAction =
  | QLIB_SET_ALL
  | QLIB_ADD_ITEM
  | QLIB_REMOVE_ITEM
  | QLIB_EDIT_ITEM
  | QLIB_MOVE_ITEM

export interface QLIB_SET_ALL {
  type: "QLIB_SET_ALL"
  rootGroup: Group
}

export interface QLIB_ADD_ITEM {
  type: "QLIB_ADD_ITEM"
  item: Query | Group
  groupPath: number[]
}

export interface QLIB_REMOVE_ITEM {
  type: "QLIB_REMOVE_ITEM"
  itemPath: number[]
}

export interface QLIB_EDIT_ITEM {
  type: "QLIB_EDIT_ITEM"
  item: Query | Group
  itemPath: number[]
}

export interface QLIB_MOVE_ITEM {
  type: "QLIB_MOVE_ITEM"
  srcItemPath: number[]
  destItemPath: number[]
}
