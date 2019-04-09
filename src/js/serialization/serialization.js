/* @flow */

import {getDeepTypes} from "./getDeepTypes"
import {getSerializer} from "../serialization/serializers"
import {mapWithTypes} from "./mapWithTypes"

export function serialize(object: Object) {
  const __types = getDeepTypes(object)
  const newObject = mapWithTypes(object, __types, serializeOne)
  newObject.__types = __types
  return newObject
}

export function deserialize(object: Object) {
  const {__types, ...rest} = object
  return mapWithTypes(rest, __types, deserializeOne)
}

function serializeOne(value, type) {
  return getSerializer(type).serialize(value)
}

function deserializeOne(value, type) {
  return getSerializer(type).deserialize(value)
}
