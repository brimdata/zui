import {Client} from "./client"
import {DefaultContext, TypeDefs} from "./zed/context"
import * as zed from "./zed/index"
import * as zjson from "./zjson"

type DecodeOpts = {
  context?: zed.Context
  as?: "zed" | "js"
  typedefs?: TypeDefs
}

function decode(data: zjson.RootRecord[], opts: DecodeOpts & {as: "js"}): object
function decode(data: zjson.RootRecord, opts?: DecodeOpts): zed.Record
function decode(data: zjson.RootRecord[], opts?: DecodeOpts): zed.Record[]
function decode(data: zjson.EncodedField, opts?: DecodeOpts): zed.Field
function decode(
  data: zjson.RootRecord | zjson.RootRecord[] | zjson.EncodedField,
  opts: DecodeOpts = {}
) {
  const defaults = {as: "zed", context: DefaultContext}
  const options = {...defaults, ...opts}
  const {context, as, typedefs} = options
  if (Array.isArray(data)) {
    const zed = context.decode(data, typedefs)
    if (as === "js") return zed.map((d) => d.toJS())
    else return zed
  } else if ("path" in data) {
    return context.decodeField(data)
  } else {
    const zed = context.decodeRecord(data, typedefs)
    if (as === "js") return zed.toJS()
    else return zed
  }
}

type EncodeOpts = {
  context?: zed.Context
}

function encode(data: zed.Record, opts?: EncodeOpts): zjson.RootRecord
function encode(data: zed.Record[], opts?: EncodeOpts): zjson.RootRecord[]
function encode(data: zed.Field, opts?: EncodeOpts): zjson.EncodedField
function encode(
  data: zed.Field | zed.Record | zed.Record[],
  opts: EncodeOpts = {}
) {
  const defaults = {context: DefaultContext}
  const options = {...defaults, ...opts}
  const {context} = options
  if (Array.isArray(data)) {
    return context.encode(data)
  } else if (data instanceof zed.Field) {
    return context.encodeField(data)
  } else {
    return context.encodeRecord(data)
  }
}

export {Client, encode, decode, zjson, zed, DefaultContext}
