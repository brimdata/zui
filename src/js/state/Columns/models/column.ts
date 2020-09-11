import {Column} from "../../../types"

export type $Column = {name: string; type: string; key: string}

export function createColumn(c: Column) {
  return {
    ...c,
    key: `${c.name}:${c.type}`
  }
}
