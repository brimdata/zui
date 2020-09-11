import md5 from "md5"

import {Descriptor, Descriptors} from "../../../types"
import columnKey from "../../../lib/columnKey"

export function hashDescriptorKeys(desc: Descriptors) {
  const newObj = {}

  for (const td in desc) {
    const columns = desc[td]
    const hash = descriptorHash(columns)

    newObj[hash] = columns
  }

  return newObj
}

function descriptorHash(desc: Descriptor) {
  const string = desc.map(columnKey).join(" ")

  return md5(string)
}
