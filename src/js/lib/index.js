/* @flow */

import {isEmpty} from "lodash"

import {isArray} from "./is"
import animation from "./animation"
import doc from "./doc"
import file from "./file"
import keep from "./keep"
import obj from "./obj"
import win from "./win"

let array = {
  wrap(item: *) {
    if (isArray(item)) return item
    if (isEmpty(item)) return []
    return [item]
  }
}

export default {
  file,
  keep,
  obj,
  doc,
  win,
  array,
  animation
}
