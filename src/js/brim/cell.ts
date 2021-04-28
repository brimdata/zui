import {zed} from "zealot"
import {createComplexCell} from "./complexCell"
import {createPrimitiveCell} from "./primitiveCell"

export interface Cell {
  guessWidth: () => number
}

type Args = {
  name: string
  data: ZedData
}

export function createCell({name, data}: Args): Cell {
  if (data instanceof zed.Primitive) {
    return createPrimitiveCell({name, data})
  } else {
    return createComplexCell({name, data})
  }
}
