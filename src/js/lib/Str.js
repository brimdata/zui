/* @flow */

import _trim from "lodash/trim"

export const onlyWhitespace = (value: string) => {
  return /^\s*$/.test(value)
}

export const escapeSpaces = (value: string) => {
  if (/\s+/.test(value)) {
    return `"${value}"`
  } else {
    return value
  }
}

export const trim = (value: string) => {
  return _trim(value)
}
