/* @flow */
import {msToTs} from "./time"

export default (date: Date) => {
  return msToTs(date.getTime())
}
