export {decode, encode} from "../encoder"
export {parseAst} from "../parser"
export {ResultStream} from "../query/result-stream"
export {DefaultContext, TypeDefs} from "../zed/context"
export * as zjson from "../zjson"
export * from "../test/factory"
export * from "../client/types"
export * from "../types"

// Rig up the client to use the window object's fetch
import {Client as BaseClient} from "../client/client"
BaseClient.fetch = window.fetch.bind(window)
export const Client = BaseClient
