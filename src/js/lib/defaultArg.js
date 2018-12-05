/* @flow */

export default (value: *, defaultValue: *) => {
  if (value === undefined) {
    return defaultValue
  } else {
    return value
  }
}
