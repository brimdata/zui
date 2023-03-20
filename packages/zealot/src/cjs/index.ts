export {decode, encode} from "../encoder"
export {parseAst} from "../parser"
export {ResultStream} from "../query/result-stream"
export {DefaultContext, TypeDefs} from "../zed/context"
export * as zjson from "../zjson"
export * as zed from "../zed"
export * from "../test/factory"
export * from "../client/types"
export * from "../types"

// Rig up the client to use node fetch
import fetch from "node-fetch"
import {Client as BaseClient} from "../client/client"

// @ts-ignore
BaseClient.fetch = fetch

export class Client extends BaseClient {}

// Node Specific Exports

export * from "../lake/lake"
