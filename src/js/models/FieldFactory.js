/* @flow */

import * as F from "./Field"

type Args = {
  name: string,
  type: string,
  value: string
}

const NULL_VAL = "-"

export default class FieldFactory {
  static create(args: Args) {
    if (args.value === NULL_VAL) return new F.NullField(args)

    switch (args.type) {
      case "time":
        return new F.TimeField(args)
      case "interval":
        return new F.IntervalField(args)
      case "count":
        return new F.CountField(args)
      default:
        return new F.default(args)
    }
  }
}
