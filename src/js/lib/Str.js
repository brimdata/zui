/* @flow */

import _trim from "lodash/trim"
import _capitalize from "lodash/capitalize"

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

export const capitalize = _capitalize
