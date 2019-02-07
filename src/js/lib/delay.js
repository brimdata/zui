/* @flow */

export default (ms: number, func: Function) => {
  return setTimeout(func, ms)
}
