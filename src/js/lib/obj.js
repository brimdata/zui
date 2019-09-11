/* @flow */
export default function obj(o: Object) {
  return {
    toString(num: number | void) {
      return JSON.stringify(o, null, num)
    }
  }
}
