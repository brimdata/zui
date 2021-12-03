// This is where we depend on a script buried in a Zed
// node module in the root directory to parse z.

// @ts-ignore
import parser from "zed/compiler/parser/parser"
// @ts-ignore
export const parse = parser.parse
