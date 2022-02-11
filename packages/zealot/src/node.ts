export * from "./lake/lake"
export * from "./cmd/zq"
import {getPath as _getPath} from "./cmd/paths"

/**
 * export * from "./cmd/paths" actually changes the value of __dirname
 * which we rely on in the getPath function.
 */
export const getPath = _getPath
