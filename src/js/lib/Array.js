/* @flow */

import isEqual from "lodash/isEqual"

export const indexOfLastChange = (
  list: *[],
  accessor: (*) => * = item => item
) => {
  let index = list.length - 1
  const last = accessor(list[index])
  while (index > 0) {
    index -= 1
    const current = accessor(list[index])
    if (!isEqual(current, last)) break
  }
  return index
}
