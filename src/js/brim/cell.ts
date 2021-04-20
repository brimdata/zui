import {ZedData, ZedPrimitive} from "zealot/zed"
import {createComplexCell} from "./complexCell"
import {createPrimitiveCell} from "./primitiveCell"

export interface Cell {
  name: string
  queryableValue: () => string
  stringValue: () => string
  display: () => string
  compound: () => boolean
  guessWidth: () => number
}

type Args = {
  name: string
  data: ZedData
}

export function createCell({name, data}: Args): Cell {
  if (data instanceof ZedPrimitive) {
    return createPrimitiveCell({name, data})
  } else {
    return createComplexCell({name, data})
  }
}
