/* @flow */

import md5 from "md5"

import type {Descriptor, Descriptors} from "../../../types"
import columnKey from "../../../lib/columnKey"

export function hashDescriptorKeys(desc: Descriptors) {
  let newObj = {}

  for (let td in desc) {
    let columns = desc[td]
    let hash = descriptorHash(columns)

    newObj[hash] = columns
  }

  return newObj
}

function descriptorHash(desc: Descriptor) {
  let string = desc.map(columnKey).join(" ")

  return md5(string)
}
