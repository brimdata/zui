import {DefaultContext} from "./zed/context"
import {DecodeStream} from "./zed/decode-stream"
import * as zed from "./zed/index"
import * as zjson from "./zjson"

type DecodeOpts = {
  context?: zed.Context
  stream?: DecodeStream
}

export function decode(data: zjson.Object[], opts: DecodeOpts): zed.Value[]
export function decode(data: zjson.Object, opts?: DecodeOpts): zed.Value
export function decode(data: zjson.Object[], opts?: DecodeOpts): zed.Value[]
export function decode(data: zjson.EncodedField, opts?: DecodeOpts): zed.Field
export function decode(
  data: zjson.Object | zjson.Object[] | zjson.EncodedField,
  opts: DecodeOpts = {}
) {
  const defaults = {context: DefaultContext}
  const options = {...defaults, ...opts}
  const {context} = options
  if (Array.isArray(data)) {
    return context.decode(data, options.stream)
  } else if ("path" in data) {
    return context.decodeField(data)
  } else {
    return context.decodeOne(data, options.stream)
  }
}

type EncodeOpts = {
  context?: zed.Context
}

export function encode(data: zed.Value, opts?: EncodeOpts): zjson.Object
export function encode(data: zed.Value[], opts?: EncodeOpts): zjson.Object[]
export function encode(data: zed.Field, opts?: EncodeOpts): zjson.EncodedField
export function encode(
  data: zed.Field | zed.Value | zed.Value[],
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
    return context.encodeOne(data)
  }
}
