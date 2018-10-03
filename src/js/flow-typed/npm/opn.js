/* @flow */

declare module 'opn' {
  declare module.exports:
  (path: string, opts: Object | void) => Promise<any>
}
