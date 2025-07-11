import { DefaultContext, ZedContext } from './context';
import { DecodeStream } from './decode-stream';
import { Field } from './values/field';
import { Value } from './values/types';
import * as jsup from './jsup';

type DecodeOpts = {
  context?: ZedContext;
  stream?: DecodeStream;
};

export function decode(data: jsup.Obj[], opts: DecodeOpts): Value[];
export function decode(data: jsup.Obj, opts?: DecodeOpts): Value;
export function decode(data: jsup.Obj[], opts?: DecodeOpts): Value[];
export function decode(data: jsup.EncodedField, opts?: DecodeOpts): Field;
export function decode(
  data: jsup.Obj | jsup.Obj[] | jsup.EncodedField,
  opts: DecodeOpts = {}
) {
  const defaults = { context: DefaultContext };
  const options = { ...defaults, ...opts };
  const { context } = options;
  if (Array.isArray(data)) {
    return context.decode(data, options.stream);
  } else if ('path' in data) {
    return context.decodeField(data);
  } else {
    return context.decodeOne(data, options.stream);
  }
}

type EncodeOpts = {
  context?: ZedContext;
};

export function encode(data: Value, opts?: EncodeOpts): jsup.Obj;
export function encode(data: Value[], opts?: EncodeOpts): jsup.Obj[];
export function encode(data: Field, opts?: EncodeOpts): jsup.EncodedField;
export function encode(data: Field | Value | Value[], opts: EncodeOpts = {}) {
  const defaults = { context: DefaultContext };
  const options = { ...defaults, ...opts };
  const { context } = options;
  if (Array.isArray(data)) {
    return context.encode(data);
  } else if (data instanceof Field) {
    return context.encodeField(data);
  } else {
    return context.encodeOne(data);
  }
}
