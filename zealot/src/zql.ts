// This is where we depend on a script buried in a zq
// node module in the root directory to parse zql.
// It's wierd too because we need to make this relative
// to where this file is after it's built, not where
// it lives here in the src folder.

// @ts-ignore
import zql from "../../node_modules/zq/zql/zql.es"

export const parse = zql.parse
