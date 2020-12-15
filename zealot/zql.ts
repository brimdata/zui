// This is where we depend on a script buried in a zq
// node module in the root directory to parse zql.

// @ts-ignore
import zql from "zq/zql/zql.es"
// @ts-ignore
export const parse = zql.parse
