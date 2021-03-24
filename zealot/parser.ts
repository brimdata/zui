// This is where we depend on a script buried in a zq
// node module in the root directory to parse z.

// @ts-ignore
import parser from "zq/compiler/parser/parser"
// @ts-ignore
export const parse = parser.parse
