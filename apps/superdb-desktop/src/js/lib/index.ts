import {isEmpty} from "lodash"
import uniq from "lodash/uniq"

import {isArray} from "./is"
import animation from "./animation"
import date from "./date"
import doc from "./doc"
import obj from "./obj"
import transaction from "./transaction"
import win from "./win"

const array = {
  wrap(item: any) {
    if (isArray(item)) return item
    if (isEmpty(item)) return []
    return [item]
  },
}

export default {
  obj,
  doc,
  win,
  array,
  animation,
  date,
  transaction,
  compact: (array: any[]) => array.filter((item) => !!item),
  uniq,
  bounded: (num: number, [from, to]: [number, number]) => {
    return Math.max(from, Math.min(num, to))
  },
  move: <T>(array: T[], src: number, dest: number): T[] => {
    const copy = [...array]
    copy.splice(dest, 0, copy.splice(src, 1)[0])
    return copy
  },
  sleep: (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
}
