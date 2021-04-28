// import {
//   ZedArray,
//   ZedEnum,
//   ZedMap,
//   zed.Record,
//   ZedSet,
//   ZedUnion
// } from "zealot/zed"
// import {createCell} from "./cell"
// import {ONE_CHAR} from "./primitiveCell"

// export const COMPOUND_FIELD_RGX = /^(set|array|union|record)$/

// export type ComplexCell = ReturnType<typeof createComplexCell>

// type Args = {
//   name: string
//   data: zed.Record | ZedArray | ZedSet | ZedUnion | ZedEnum | ZedMap
// }

// export function createComplexCell({name, data}: Args) {
//   const items =
//     "items" in data
//       ? data.items.map((data, i) => createCell({name: `${name}.${i}`, data}))
//       : []

//   return {
//     name,
//     container: data.constructor.name,
//     length: items.length,
//     item: (index: number) => items[index],

//     stringValue() {
//       return data.toString()
//     },
//     compound() {
//       return true
//     },
//     guessWidth() {
//       const comma = ONE_CHAR
//       const wrap = 2 * ONE_CHAR
//       let sum = 0
//       for (const item of items) {
//         sum += item.guessWidth()
//       }
//       sum += comma * (items.length - 1)
//       sum += wrap
//       return sum
//     }
//   }
// }
