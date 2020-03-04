/* @flow */
import ZQL from "zq/zql/zql.js"

import type {TimeArg, ZealotSearchArgs} from "./"
import {isString} from "../../lib/is"
import brim from "../../brim"

export default function searchApi(zql: string, args: ZealotSearchArgs) {
  return {
    method: "POST",
    path: "/search?format=zjson",
    body: JSON.stringify(getSearchBody(zql, args))
  }
}

export function getSearchBody(
  zql: string,
  {space, from, to}: ZealotSearchArgs
) {
  let proc = ZQL.parse(zql)
  let fromTs = getTime(from)
  let toTs = getTime(to)
  return {
    proc,
    space,
    dir: -1,
    span: {
      ts: fromTs,
      dur: getDuration(fromTs, toTs)
    }
  }
}

function getTime(arg: TimeArg, now = new Date()) {
  if (isString(arg)) {
    return brim.relTime(arg, now).toTs()
  } else {
    return brim.time(arg).toTs()
  }
}

function getDuration(from, to) {
  let ms = brim
    .time(from)
    .toDate()
    .getTime()
  return brim
    .time(to)
    .subtract(ms, "ms")
    .toTs()
}
