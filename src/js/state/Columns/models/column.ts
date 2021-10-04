export type ColumnName = string | string[]
export type $Column = {name: ColumnName; key: string}

export function createColumn(name: ColumnName) {
  return {name, key: Array.isArray(name) ? name.join("") : name}
}

export function printColumnName(name: ColumnName) {
  return [].concat(name).join(" › ")
}
