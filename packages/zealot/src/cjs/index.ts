export {decode, encode} from "../encoder"
export {parseAst} from "../parser"
export {ResultStream} from "../query/result-stream"
export {DefaultContext, TypeDefs} from "../zed/context"
export * as zjson from "../zjson"
export * from "../test/factory"
export * from "../client/types"
export * from "../types"

// Rig up the client to use node fetch
import fetch from "node-fetch"
import {Client as BaseClient} from "../client/client"
BaseClient.fetch = fetch
export const Client = BaseClient

// Node Specific Exports

export * from "../lake/lake"
