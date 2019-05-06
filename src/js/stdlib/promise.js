/* @flow */

export function serially(promises: *[]) {
  return promises.reduce((chain, next) => {
    return chain.then((vals) => {
      if (next instanceof Promise) {
        return next.then((val) => [...vals, val])
      } else {
        return [...vals, next]
      }
    })
  }, Promise.resolve([]))
}
