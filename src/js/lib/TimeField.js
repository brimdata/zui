/* @flow */

export const toDate = (value: string) => {
  return new Date(+value * 1000)
}
