/* @flow */

export default ([from, to]: [Date, Date]) => {
  return ((to - from) / 1000).toString()
}
